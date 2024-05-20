import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NoteDetailedComponent } from './note-detailed.component'

describe('NoteDetailedComponent', () => {
   let component: NoteDetailedComponent
   let fixture: ComponentFixture<NoteDetailedComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [NoteDetailedComponent],
      }).compileComponents()

      fixture = TestBed.createComponent(NoteDetailedComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
