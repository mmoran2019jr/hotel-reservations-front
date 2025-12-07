import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsListPage } from './rooms-list-page';

describe('RoomsListPage', () => {
  let component: RoomsListPage;
  let fixture: ComponentFixture<RoomsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomsListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
