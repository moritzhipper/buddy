import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTherapyTypeComponent } from './input-therapy-type.component';

describe('InputTherapyTypeComponent', () => {
   let component: InputTherapyTypeComponent;
   let fixture: ComponentFixture<InputTherapyTypeComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [InputTherapyTypeComponent],
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(InputTherapyTypeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
