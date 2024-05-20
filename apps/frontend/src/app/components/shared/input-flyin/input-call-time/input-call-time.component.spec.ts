import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InputCallTimeComponent } from './input-call-time.component'

describe('InputCallTimeComponent', () => {
   let component: InputCallTimeComponent
   let fixture: ComponentFixture<InputCallTimeComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [InputCallTimeComponent],
      }).compileComponents()
   })

   beforeEach(() => {
      fixture = TestBed.createComponent(InputCallTimeComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
