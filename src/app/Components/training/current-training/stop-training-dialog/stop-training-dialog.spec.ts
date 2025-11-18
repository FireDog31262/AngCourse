import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopTrainingDialog } from './stop-training-dialog';
import { appTestingProviders } from '../../../../../testing/app-testing-providers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('StopTrainingDialog', () => {
  let component: StopTrainingDialog;
  let fixture: ComponentFixture<StopTrainingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopTrainingDialog],
      providers: [
        ...appTestingProviders(),
        { provide: MAT_DIALOG_DATA, useValue: { progress: 0 } }
      ]
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
