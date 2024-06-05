import { CommonModule } from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { Therapist } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { InputResolveTypes, InputService, InputTypes } from 'apps/frontend/src/app/services/input.service'
import { therapistActions } from 'apps/frontend/src/app/store/buddy.actions'

@Component({
   selector: 'app-search-results',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './search-results.component.html',
   styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
   @Input() therapists: Therapist[]

   inputService = inject(InputService)
   store = inject(Store)

   async addTherapist(therapist: Therapist) {
      //hier popup 'Therapeut übernehmen?'
      const wantsToSaveResponse = await this.inputService.openInputDialogue({
         type: InputTypes.CONFIRM,
         header: 'Person speichern',
         description: `Möchtest du ${therapist.name} in deine persönliche Liste übernehmen?`,
      })

      if (wantsToSaveResponse.type === InputResolveTypes.CONFIRM) {
         const { id } = therapist

         this.store.dispatch(therapistActions.create({ props: { id } }))
      }

      console.log(therapist.name, therapist.id)
   }
}
