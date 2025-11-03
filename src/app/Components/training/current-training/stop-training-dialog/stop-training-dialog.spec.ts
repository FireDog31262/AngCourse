import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopTrainingDialog } from './stop-training-dialog';

describe('StopTrainingDialog', () => {
  let component: StopTrainingDialog;
  let fixture: ComponentFixture<StopTrainingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopTrainingDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopTrainingDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
