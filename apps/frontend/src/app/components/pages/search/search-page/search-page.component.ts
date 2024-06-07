import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Therapist, TherapistSearch } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { selectSearch, selectTherapists } from 'apps/frontend/src/app/store/buddy.selectors'
import { Subscription } from 'rxjs'
import { InputResolveTypes, InputService, InputTypes } from '../../../../services/input.service'
import { ToastService } from '../../../../services/toast.service'
import { searchActions, therapistActions } from '../../../../store/buddy.actions'
import { PagePlaceholderTextComponent } from '../../../shared/page-placeholder-text/page-placeholder-text.component'
import { SearchResultsComponent } from '../search-results/search-results.component'

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [CommonModule, PagePlaceholderTextComponent, SearchResultsComponent],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit, OnDestroy {
   inputService = inject(InputService)
   toastService = inject(ToastService)
   store = inject(Store)

   // replace with search results
   therapists = this.store.select(selectTherapists)

   city: string
   postalCode: string
   types: string[]
   results: Therapist[]

   subscription: Subscription

   allFiltersEmpty = true

   ngOnInit(): void {
      this.subscription = this.store.select(selectSearch).subscribe((searchState) => {
         const { parameters } = searchState
         this.allFiltersEmpty = !parameters.city && !parameters.postalCode && !parameters?.therapyTypes?.length
         this.results = searchState.results
         this.city = parameters.city
         this.postalCode = parameters.postalCode
         this.types = parameters.therapyTypes
      })
   }

   ngOnDestroy(): void {
      this.subscription.unsubscribe()
   }

   addFilterCity() {
      this.inputService
         .openInputDialogue({
            header: 'In Welcher Stadt suchst du?',
            label: 'Stadt',
            type: InputTypes.TEXT_SHORT,
            canRemove: true,
            preset: this.city,
         })
         .then((v) => {
            if (v.type !== InputResolveTypes.DISCARD) {
               this.updateSearch({ city: v.value })
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
            preset: this.postalCode,
         })
         .then((v) => {
            if (v.type !== InputResolveTypes.DISCARD) {
               this.updateSearch({ postalCode: v.value })
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
            preset: this.types,
         })
         .then((v) => {
            if (v.type !== InputResolveTypes.DISCARD) {
               this.updateSearch({ therapyTypes: v.value })
            }
         })
   }

   private updateSearch(search: TherapistSearch) {
      this.store.dispatch(searchActions.saveSearch({ props: { ...search } }))
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
      const cityString = [this.postalCode, this.city].filter(Boolean).join(', ')

      if (cityString) {
         return `in ${cityString}`
      } else {
         return null
      }
   }

   getTypesFilterAsProse(): string {
      const types = !!this.types?.length ? [...this.types] : []
      let sentence = 'mit den Fachgebieten '

      if (types.length === 0) {
         return null
      } else if (types.length === 1) {
         sentence += `${types[0]}`
      } else if (types.length === 2) {
         sentence += `${types[0]} und ${types[1]}`
      } else if (this.types.length > 2) {
         const lastType = types.pop()
         sentence += `${types.join(', ')} und ${lastType}`
      }

      return sentence
   }
}
