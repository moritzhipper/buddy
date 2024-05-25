import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { Store, StoreModule } from '@ngrx/store'
import { Observable } from 'rxjs'
import { InputWrapperComponent } from './components/shared/input-flyin/input-wrapper/input-wrapper.component'
import { NavigationBarComponent } from './components/shared/navigation-bar/navigation-bar.component'
import { ToastComponent } from './components/shared/toast/toast.component'
import { Goal, Note, Therapist, ToastType } from './models'
import { NotificationService } from './services/notification.service'
import { ToastService } from './services/toast.service'
import { therapistActions } from './store/buddy.actions'
import { BuddyState } from './store/buddy.state'

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [RouterModule, StoreModule, ToastComponent, InputWrapperComponent, NavigationBarComponent, CommonModule],
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
   showDebugButtons = false
   private _toastIterator = 1
   isOffline = false
   profilePageIsOpen$: Observable<boolean>
   private _store = inject(Store<BuddyState>)

   private notificationService = inject(NotificationService)
   private toastService = inject(ToastService)

   ngOnInit(): void {
      this.updateOnlineStatus()
      window.addEventListener('online', this.updateOnlineStatus.bind(this))
      window.addEventListener('offline', this.updateOnlineStatus.bind(this))
   }

   private updateOnlineStatus(): void {
      this.isOffline = !window.navigator.onLine

      if (!this.isOffline) {
         this.toastService.sendToast({ text: 'Du bist wieder online' })
      }
   }

   sendNotification() {
      this.notificationService.askPermission()
      this.notificationService.send({
         title: 'Test notification header',
         body: 'Test notification bodytext',
      })
   }

   sendToast() {
      switch (this._toastIterator) {
         case 1: {
            this.toastService.sendToast({
               text: 'Dies ist eine Toastbenachrichtigung mit einem mittellangen Textinhalt',
            })
            this._toastIterator++
            break
         }
         case 2: {
            this.toastService.sendToast({
               text: 'Dies ist ein Toasterror mit einem mittellangen Textinhalt',
               type: ToastType.ERROR,
            })
            this._toastIterator++
            break
         }
         case 3: {
            this.toastService.sendToast({
               text: 'Dies ist ein Toastsuccess mit mittellangen Textinhalt',
               type: ToastType.SUCCESS,
            })
            this._toastIterator = 1
            break
         }
      }
   }

   initMocks() {
      const therapists: Therapist[] = [
         {
            name: 'Hr. Dipl. Psych. Wiedeman',
            email: 'wiedeman@psychologieonline.de',
            note: 'Hier stehen weitere Notizen. Herr Wiedemann war sympathisch, aber zu professionell/ distanziert. Trotzdem in Erwägung ziehen.',
            phone: '0711 2394732',
            address: {
               street: 'gutenbergstr.',
               number: '110',
               postalCode: 70197,
               city: 'Stuttgart',
            },
            callTimes: [
               {
                  weekday: 'mo',
                  from: '12:30',
                  to: '12:50',
                  reminder: true,
               },
               {
                  weekday: 'do',
                  from: '05:10',
                  to: '20:25',
               },
               {
                  weekday: 'sa',
                  from: '10:13',
                  to: '20:16',
                  reminder: true,
               },
            ],
         },
         {
            name: 'Hr. Dipl. Psych. Wiedeman',
            note: 'Hier stehen weitere Notizen. Herr Wiedemann war sympathisch, aber zu professionell/ distanziert. Trotzdem in Erwägung ziehen.',
            email: 'wiedemann@psychozentrum.de',
            callTimes: [
               {
                  weekday: 'mi',
                  from: '05:10',
                  to: '05:11',
               },
            ],
         },
         {
            name: 'Hr. Dipl. Psych. Wiedeman',
         },
      ]

      const notes: Note[] = [
         {
            body: 'Grenzen ziehen \n ölkdsföldskf öl ködsfj sfd sdölfk sf f sölf gf sddfsdfsdfsft xcxöxcölxcölö xcö',
            createdAt: new Date(),
         },
         {
            body: 'test dss v cxvxc vxc  texsdfsdfsdfsdfsdfsft xcxöxcölxcölö xcö',
            createdAt: new Date(),
            isImportant: true,
         },
         {
            body: 'test texsdfsdfsdf yxycxxc. xyycx.  ycxcyxc .sdfs dfsft xcxöxcölxcölö xcö',
            createdAt: new Date(),
            isImportant: true,
         },
         {
            body: 'test texsdfsdfsdfsdfsdfsft xcxöxcölxcölö xcö',
            createdAt: new Date(),
         },
      ]

      const goals: Goal[] = [
         {
            body: 'Traum mit Dino',
         },
         {
            body: 'sie lässt mich nie ausreden',
         },
         {
            body: 'ich habe angst vor zugfahrten',
         },
      ]

      therapists.forEach((v) => this._store.dispatch(therapistActions.create({ props: v })))
   }

   reset() {}
}
