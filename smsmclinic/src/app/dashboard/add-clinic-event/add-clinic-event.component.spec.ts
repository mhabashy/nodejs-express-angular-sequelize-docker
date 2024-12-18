import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClinicEventComponent } from './add-clinic-event.component';

describe('AddClinicEventComponent', () => {
  let component: AddClinicEventComponent;
  let fixture: ComponentFixture<AddClinicEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClinicEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClinicEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
