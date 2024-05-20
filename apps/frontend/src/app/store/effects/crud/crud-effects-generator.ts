import { inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'
import { BackendAdapterService } from '../../../services/backend-adapter.service'
import { httpErrorActions, loadAllDataActions } from '../../buddy.actions'

export class CrudEffectsGenerator {
   private actions$ = inject(Actions)
   private backendAdapter = inject(BackendAdapterService)

   private crudActions
   private route: string

   constructor(crudActions, route: string) {
      this.route = route
      this.crudActions = crudActions
   }

   createEffect = () =>
      createEffect(() =>
         this.actions$.pipe(
            ofType(this.crudActions.create),
            switchMap((action) =>
               this.backendAdapter.postUniqueItem(action.props, this.route).pipe(
                  map((resourceHavingID) => this.crudActions.save({ props: resourceHavingID })),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
            )
         )
      )

   /**
    * automatically fetches info after login
    */
   readOnLoginEffect = (fullUserOnly = true) => {
      const triggerActions = fullUserOnly ? [loadAllDataActions.fullUser] : [loadAllDataActions.fullUser, loadAllDataActions.basicUser]

      return createEffect(() =>
         this.actions$.pipe(
            ofType(...triggerActions),
            switchMap(() =>
               this.backendAdapter.get(this.route).pipe(
                  map((itemList) => this.crudActions.saveMany({ props: itemList })),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
            )
         )
      )
   }

   updateEffect = () =>
      createEffect(() =>
         this.actions$.pipe(
            ofType(this.crudActions.update),
            switchMap((action) =>
               this.backendAdapter.patchUniqueItem(action.props, this.route).pipe(
                  map((resource) => this.crudActions.save({ props: resource })),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
            )
         )
      )

   deleteEffect = () =>
      createEffect(() =>
         this.actions$.pipe(
            ofType(this.crudActions.delete),
            switchMap((action) =>
               this.backendAdapter.deleteUniqueItem(action.id, this.route).pipe(
                  map((id) => this.crudActions.deleteSuccess({ id })),
                  catchError((error) => of(httpErrorActions.handle({ error })))
               )
            )
         )
      )
}
