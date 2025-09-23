import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastTraining } from './past-training';

describe('PastTraining', () => {
  let component: PastTraining;
  let fixture: ComponentFixture<PastTraining>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastTraining]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastTraining);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
