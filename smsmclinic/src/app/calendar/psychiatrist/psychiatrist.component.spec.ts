import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychiatristComponent } from './psychiatrist.component';

xdescribe('PsychiatristComponent', () => {
  let component: PsychiatristComponent;
  let fixture: ComponentFixture<PsychiatristComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsychiatristComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsychiatristComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
