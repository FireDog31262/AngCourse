import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavList } from './side-nav-list';

describe('SideNavList', () => {
  let component: SideNavList;
  let fixture: ComponentFixture<SideNavList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
