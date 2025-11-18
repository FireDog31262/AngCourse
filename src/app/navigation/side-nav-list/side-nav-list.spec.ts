import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { SideNavList } from './side-nav-list';
import { appTestingProviders } from '../../../testing/app-testing-providers';

describe('SideNavList', () => {
  let component: SideNavList;
  let fixture: ComponentFixture<SideNavList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavList],
      providers: [...appTestingProviders()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavList);
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
