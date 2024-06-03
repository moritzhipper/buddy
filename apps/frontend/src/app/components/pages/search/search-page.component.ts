import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { TherapyTypeList } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { InputResolveTypes, InputService, InputTypes } from '../../../services/input.service'
import { ToastService } from '../../../services/toast.service'
import { therapistActions } from '../../../store/buddy.actions'
import { PagePlaceholderTextComponent } from '../../shared/page-placeholder-text/page-placeholder-text.component'

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [CommonModule, PagePlaceholderTextComponent],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
   inputService = inject(InputService)
   store = inject(Store)
   toastService = inject(ToastService)
   therapyTypes = TherapyTypeList
   isFilterOpen = false

   filterCity: string
   filterPostal: string
   filterType: string[]

   allFiltersEmpty = () => !(!!this.filterCity || !!this.filterPostal || this.filterType?.length > 0)

   addFilterCity() {
      this.inputService
         .openInputDialogue({
            header: 'Stadt angeben',
            label: 'Stadt',
            type: InputTypes.TEXT_SHORT,
            canRemove: true,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this.filterCity = v.value
            } else if (v.type === InputResolveTypes.DELETE) {
               this.filterCity = null
            }
         })
   }

   addFilterPostal() {
      this.inputService
         .openInputDialogue({
            header: 'Postleitzahl angeben',
            label: 'Postleitzahl',
            type: InputTypes.NUMBER,
            canRemove: true,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this.filterPostal = v.value
            } else if (v.type === InputResolveTypes.DELETE) {
               this.filterPostal = null
            }
         })
   }

   addFilterType() {
      this.inputService
         .openInputDialogue({
            header: 'Therapiearten angeben',
            type: InputTypes.THERAPYTYPE,
            canRemove: true,
            preset: this.filterType,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this.filterType = v.value
            } else if (v.type === InputResolveTypes.DELETE) {
               this.filterType = null
            }
         })
   }

   addTherapist() {
      this.inputService
         .openInputDialogue({
            header: 'Therapeut*in hinzufügen',
            description: 'Lege die Person neu an oder importiere sie',
            type: InputTypes.THERAPIST,
         })
         .then((v) => {
            if (v.type === InputResolveTypes.CONFIRM) {
               this.store.dispatch(therapistActions.create({ props: v.value }))
               this.toastService.sendToast({ text: 'Du findest deine Therapet*innen unter "Finden"' })
            }
         })
   }
}
