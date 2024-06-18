import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
   providedIn: 'root',
})
export class LoadingIdicatorService {
   private loadingSubject = new BehaviorSubject<boolean>(false)
   loadingState = this.loadingSubject.asObservable()

   setIsLoading() {
      this.loadingSubject.next(true)
   }
   setNotLoading() {
      this.loadingSubject.next(false)
   }
}
