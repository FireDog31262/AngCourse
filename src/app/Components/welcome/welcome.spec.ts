import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welcome } from './welcome';
import { appTestingProviders } from '../../../testing/app-testing-providers';

describe('Welcome', () => {
  let component: Welcome;
  let fixture: ComponentFixture<Welcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome],
      providers: [...appTestingProviders()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Welcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
