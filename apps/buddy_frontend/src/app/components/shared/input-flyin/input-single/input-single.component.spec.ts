import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSingleComponent } from './input-single.component';

describe('InputSingleComponent', () => {
  let component: InputSingleComponent;
  let fixture: ComponentFixture<InputSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
