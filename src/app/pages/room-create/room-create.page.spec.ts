import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCreatePage } from './room-create.page';

describe('RoomCreatePage', () => {
  let component: RoomCreatePage;
  let fixture: ComponentFixture<RoomCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
