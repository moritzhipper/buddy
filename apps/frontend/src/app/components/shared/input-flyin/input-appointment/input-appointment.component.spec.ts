import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InputAppointmentComponent } from './input-appointment.component'

describe('InputAppointmentComponent', () => {
   let component: InputAppointmentComponent
   let fixture: ComponentFixture<InputAppointmentComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [InputAppointmentComponent],
      }).compileComponents()
   })

   beforeEach(() => {
      fixture = TestBed.createComponent(InputAppointmentComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
