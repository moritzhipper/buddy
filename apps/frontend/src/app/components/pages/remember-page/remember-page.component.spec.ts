import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RememberPageComponent } from './remember-page.component'

describe('RememberPageComponent', () => {
   let component: RememberPageComponent
   let fixture: ComponentFixture<RememberPageComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [RememberPageComponent],
      }).compileComponents()
   })

   beforeEach(() => {
      fixture = TestBed.createComponent(RememberPageComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
