import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TherapistCalendarComponent } from './therapist-calendar.component'

describe('TherapistCalendarComponent', () => {
   let component: TherapistCalendarComponent
   let fixture: ComponentFixture<TherapistCalendarComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [TherapistCalendarComponent],
      }).compileComponents()

      fixture = TestBed.createComponent(TherapistCalendarComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
