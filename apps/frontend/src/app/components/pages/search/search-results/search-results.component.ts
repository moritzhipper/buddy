import { CommonModule } from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { Therapist } from '@buddy/base-utils'
import { Store } from '@ngrx/store'
import { ToastType } from 'apps/frontend/src/app/models'
import { InputResolveTypes, InputService, InputTypes } from 'apps/frontend/src/app/services/input.service'
import { ToastService } from 'apps/frontend/src/app/services/toast.service'
import { therapistActions } from 'apps/frontend/src/app/store/buddy.actions'
import { scrollToTop } from 'apps/frontend/src/app/utils'

@Component({
   selector: 'app-search-results',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './search-results.component.html',
   styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
   @Input() set therapists(therapists: Therapist[]) {
      const pagesize = 10
      this.pages = []

      for (let i = 0; i < therapists.length; i += pagesize) {
         const therapistsChunk = therapists.slice(i, i + pagesize)
         this.pages.push(therapistsChunk)
      }

      this.pageCount = this.pages.length
   }

   inputService = inject(InputService)
   store = inject(Store)
   toastService = inject(ToastService)

   pages: Therapist[][] = []
   pageCount = 1
   activePage = 0

   currentlyVisibleTherapists: Therapist[] = []

   async addTherapist(therapist: Therapist) {
      const wantsToSaveResponse = await this.inputService.openInputDialogue({
         type: InputTypes.CONFIRM,
         header: 'Person speichern',
         description: `Möchtest du ${therapist.name} in deine persönliche Liste übernehmen?`,
      })

      if (wantsToSaveResponse.type === InputResolveTypes.CONFIRM) {
         const { id } = therapist

         this.store.dispatch(therapistActions.create({ props: { id } }))
         this.toastService.sendToast({ text: `${therapist.name} wurde in deine Liste aufgenommen`, type: ToastType.SUCCESS })
      }
   }

   goToNextPage() {
      if (this.activePage < this.pageCount - 1) {
         this.activePage = this.activePage + 1
         scrollToTop()
      }
   }

   goToLastPage() {
      if (this.activePage > 0) {
         this.activePage = this.activePage - 1
         scrollToTop()
      }
   }
}
