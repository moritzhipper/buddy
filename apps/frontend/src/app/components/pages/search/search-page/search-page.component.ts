import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Therapist, TherapistSearch } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { selectSearch } from 'apps/frontend/src/app/store/buddy.selectors'
import { Subscription } from 'rxjs'
import { InputResolveTypes, InputService, InputTypes } from '../../../../services/input.service'
import { ToastService } from '../../../../services/toast.service'
import { searchActions, therapistActions } from '../../../../store/buddy.actions'
import { BackgroundPictureComponent } from '../../../shared/background-picture/background-picture.component'
import { PagePlaceholderTextComponent } from '../../../shared/page-placeholder-text/page-placeholder-text.component'
import { SearchResultsComponent } from '../search-results/search-results.component'

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [CommonModule, PagePlaceholderTextComponent, SearchResultsComponent, BackgroundPictureComponent],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit, OnDestroy {
   inputService = inject(InputService)
   toastService = inject(ToastService)
   store = inject(Store)

   // 'raw' filters
   parameters: TherapistSearch
   results: Therapist[]

   // 'prose' filters
   citiyAsProse: string
   typesAsProse: string

   private subscription: Subscription

   ngOnInit(): void {
      this.subscription = this.store.select(selectSearch).subscribe((searchState) => {
         this.results = searchState.results
         if (searchState.parameters) {
            this.parameters = searchState.parameters
            this.mapFiltersToProse(searchState.parameters)
         } else {
            this.parameters = null
            this.citiyAsProse = null
            this.typesAsProse = null
         }
      })
   }

   ngOnDestroy(): void {
      this.subscription.unsubscribe()
   }

   resetFilters() {
      this.store.dispatch(searchActions.resetFilter())
   }

   addFilterCity() {
      this.inputService
         .openInputDialogue({
            header: 'In Welcher Stadt suchst du?',
            label: 'Stadt',
            type: InputTypes.TEXT_SHORT,
            canRemove: true,
            preset: this?.parameters?.city,
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
            description: 'Trenne mehrere mit Komma oder Leerzeichen',
            label: 'Postleitzahl(en)',
            type: InputTypes.TEXT_SHORT,
            canRemove: true,
            preset: this?.parameters?.postalCodes,
         })
         .then((v) => {
            if (v.type !== InputResolveTypes.DISCARD) {
               const list = this.mapStringToStringToList(v.value)
               this.updateSearch({ postalCodes: list })
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
            preset: this?.parameters?.therapyTypes,
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
               this.toastService.sendToast({ text: 'Du findest deine Therapeut*innen unter "Liste"' })
            }
         })
   }

   private mapFiltersToProse(params: TherapistSearch): void {
      const cityList = [...(params?.postalCodes || []), params?.city].filter(Boolean)
      if (cityList.length > 0) {
         this.citiyAsProse = `in ${this.mapListToProse(cityList)}`
      } else {
         this.citiyAsProse = null
      }

      if (params?.therapyTypes?.length > 0) {
         this.typesAsProse = `nach ${this.mapListToProse(params.therapyTypes)}`
      } else {
         this.typesAsProse = null
      }
   }

   private mapListToProse(list: string[]): string {
      let prose = ''
      if (!list || list.length === 0) {
         prose = null
      } else if (list.length === 1) {
         prose = list[0]
      } else if (list.length === 2) {
         prose = `${list[0]} und ${list[1]}`
      } else if (list.length > 2) {
         const lastType = list.pop()
         prose = `${list.join(', ')} und ${lastType}`
      }
      return prose
   }

   private mapStringToStringToList(listString: string): string[] {
      if (listString) {
         return listString.split(/,\s*|\s+/).filter((item) => item !== '')
      } else {
         return undefined
      }
   }
}
