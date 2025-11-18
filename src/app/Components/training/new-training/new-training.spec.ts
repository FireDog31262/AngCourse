import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTraining } from './new-training';
import { appTestingProviders } from '../../../../testing/app-testing-providers';

describe('NewTraining', () => {
  let component: NewTraining;
  let fixture: ComponentFixture<NewTraining>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTraining],
      providers: [...appTestingProviders()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTraining);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
