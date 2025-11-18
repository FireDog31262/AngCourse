import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Training } from './training';
import { appTestingProviders } from '../../../../testing/app-testing-providers';

describe('Training', () => {
  let component: Training;
  let fixture: ComponentFixture<Training>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Training],
      providers: [...appTestingProviders()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Training);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
