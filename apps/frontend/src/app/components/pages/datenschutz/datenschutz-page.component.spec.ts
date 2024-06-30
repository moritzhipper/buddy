import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DatenschutzPageComponent } from './datenschutz-page.component'

describe('DatenschutzPageComponent', () => {
   let component: DatenschutzPageComponent
   let fixture: ComponentFixture<DatenschutzPageComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [DatenschutzPageComponent],
      }).compileComponents()

      fixture = TestBed.createComponent(DatenschutzPageComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
