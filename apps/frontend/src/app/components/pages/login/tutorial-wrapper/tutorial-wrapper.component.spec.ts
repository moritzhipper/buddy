import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TutorialWrapperComponent } from './tutorial-wrapper.component'

describe('TutorialWrapperComponent', () => {
   let component: TutorialWrapperComponent
   let fixture: ComponentFixture<TutorialWrapperComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [TutorialWrapperComponent],
      }).compileComponents()
   })

   beforeEach(() => {
      fixture = TestBed.createComponent(TutorialWrapperComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
