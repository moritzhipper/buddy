import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistListItemComponent } from './therapist-list-item.component';

describe('TherapistListItemComponent', () => {
  let component: TherapistListItemComponent;
  let fixture: ComponentFixture<TherapistListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapistListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapistListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
