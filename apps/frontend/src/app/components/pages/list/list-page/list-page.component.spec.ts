import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ListPageComponent } from './list-page.component'

describe('FindPageComponent', () => {
   let component: ListPageComponent
   let fixture: ComponentFixture<ListPageComponent>

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [ListPageComponent],
      }).compileComponents()
   })

   beforeEach(() => {
      fixture = TestBed.createComponent(ListPageComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
   })

   it('should create', () => {
      expect(component).toBeTruthy()
   })
})
