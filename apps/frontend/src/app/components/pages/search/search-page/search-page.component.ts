import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { TherapyTypeList } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { selectTherapists } from 'apps/frontend/src/app/store/buddy.selectors'
import { InputResolveTypes, InputService, InputTypes } from '../../../../services/input.service'
import { ToastService } from '../../../../services/toast.service'
import { therapistActions } from '../../../../store/buddy.actions'
import { PagePlaceholderTextComponent } from '../../../shared/page-placeholder-text/page-placeholder-text.component'
import { SearchResultsComponent } from '../search-results/search-results.component'
import { BackgroundPictureComponent } from '../../../shared/background-picture/background-picture.component'

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [CommonModule, PagePlaceholderTextComponent, SearchResultsComponent, BackgroundPictureComponent],
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

   // replace with search results
   therapists = inject(Store).select(selectTherapists)

   addFilterCity() {
      this.inputService
         .openInputDialogue({
            header: 'In Welcher Stadt suchst du?',
            label: 'Stadt',
            type: InputTypes.TEXT_SHORT,
            canRemove: true,
            preset: this.filterCity,
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
            header: 'Spezifiziere die Postleitzahl',
            label: 'Postleitzahl',
            type: InputTypes.TEXT_SHORT,
            canRemove: true,
            preset: this.filterPostal,
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
            description: 'Wurden dir bei der Anamnese Empfehlungen ausgesprochen?',
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
               this.toastService.sendToast({ text: 'Du findest deine Therapeut*innen unter "Finden"' })
            }
         })
   }

   getCityFilterAsProse(): string {
      const cityString = [this.filterPostal, this.filterCity].filter(Boolean).join(', ')

      if (cityString) {
         return `in ${cityString}`
      } else {
         return null
      }
   }

   getTypesFilterAsProse(): string {
      const types = !!this.filterType?.length ? [...this.filterType] : []
      let sentence = 'mit den Fachgebieten '

      if (types.length === 0) {
         return null
      } else if (types.length === 1) {
         sentence += `${types[0]}`
      } else if (types.length === 2) {
         sentence += `${types[0]} und ${types[1]}`
      } else if (this.filterType.length > 2) {
         const lastType = types.pop()
         sentence += `${types.join(', ')} und ${lastType}`
      }

      return sentence
   }
}
