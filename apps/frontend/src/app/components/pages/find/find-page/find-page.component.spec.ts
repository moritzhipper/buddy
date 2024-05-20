import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FindPageComponent } from './find-page.component'

describe('FindPageComponent', () => {
   let component: FindPageComponent
   let fixture: ComponentFixture<FindPageComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [FindPageComponent],
      }).compileComponents()
   })

   beforeEach(() => {
      fixture = TestBed.createComponent(FindPageComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
