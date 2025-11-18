import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { Header } from './header';
import { appTestingProviders } from '../../../testing/app-testing-providers';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [...appTestingProviders()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sidenav', createSidenavStub());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createSidenavStub(): MatSidenav {
  const openedStart = new EventEmitter<void>();
  const openedChange = new EventEmitter<boolean>();
  const closedStart = new EventEmitter<void>();

  return {
    openedStart,
    openedChange,
    closedStart,
    close: () => Promise.resolve(true)
  } as unknown as MatSidenav;
}
