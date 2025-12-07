import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsListPage } from './reservations-list-page';

describe('ReservationsListPage', () => {
  let component: ReservationsListPage;
  let fixture: ComponentFixture<ReservationsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationsListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
