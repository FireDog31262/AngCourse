import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUp } from './sign-up';
import { appTestingProviders } from '../../../../testing/app-testing-providers';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [...appTestingProviders()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
