import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BackgroundPictureComponent } from './background-picture.component'

describe('BackgroundPictureComponent', () => {
   let component: BackgroundPictureComponent
   let fixture: ComponentFixture<BackgroundPictureComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [BackgroundPictureComponent],
      }).compileComponents()

      fixture = TestBed.createComponent(BackgroundPictureComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
