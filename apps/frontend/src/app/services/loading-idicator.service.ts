import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
   providedIn: 'root',
})
export class LoadingIdicatorService {
   private loadingSubject = new BehaviorSubject<boolean>(false)
   private loadingTimeout: any
   loadingState = this.loadingSubject.asObservable()

   // Timeout magic only shows spinner if the loading time is bigger than .3 seconds
   setIsLoading() {
      if (this.loadingTimeout) {
         clearTimeout(this.loadingTimeout)
      }

      this.loadingTimeout = setTimeout(() => {
         this.loadingSubject.next(true)
      }, 300)
   }
   setNotLoading() {
      if (this.loadingTimeout) {
         clearTimeout(this.loadingTimeout)
      }

      this.loadingSubject.next(false)
   }
}
