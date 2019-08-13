import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminprofilePage } from './adminprofile.page';

describe('AdminprofilePage', () => {
  let component: AdminprofilePage;
  let fixture: ComponentFixture<AdminprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
