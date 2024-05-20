import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InputTherapistComponent } from './input-therapist.component'

describe('InputTherapistComponent', () => {
   let component: InputTherapistComponent
   let fixture: ComponentFixture<InputTherapistComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [InputTherapistComponent],
      }).compileComponents()

      fixture = TestBed.createComponent(InputTherapistComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
