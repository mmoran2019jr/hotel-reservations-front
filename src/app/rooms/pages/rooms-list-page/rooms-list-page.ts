import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';
import { PageResponse } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-rooms-list-page',
  standalone: false,
  templateUrl: './rooms-list-page.html',
  styleUrl: './rooms-list-page.scss',
})
export class RoomsListPage implements OnInit {
  rooms: Room[] = [];
  totalElements = 0;
  pageSize = 6;
  pageIndex = 0;
  loading = false;

  displayedColumns = ['image', 'name', 'type', 'price', 'capacity', 'actions'];

  roomTypes: string[] = ['SIMPLE', 'DOBLE', 'SUITE'];

  private fb = inject(FormBuilder);
  private roomService= inject(RoomService);

  filterForm = this.fb.group({
    type: [''],
    minPrice: [''],
    maxPrice: [''],
    onlyAvailable: [true],
    minCapacity: [''], // lo filtramos en front
  });


  ngOnInit(): void {
    this.loadRooms();

    // refrescar cuando cambian filtros
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadRooms();
    });
  }

  loadRooms(): void {
    this.loading = true;

    const { type, minPrice, maxPrice, onlyAvailable, minCapacity } = this.filterForm.value;

    this.roomService.getRooms(
      this.pageIndex,
      this.pageSize,
      type || undefined,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      onlyAvailable ?? undefined
    )
      .subscribe({
        next: (page: PageResponse<Room>) => {
          let content = page.content;

          // filtro adicional por capacidad en front
          if (minCapacity) {
            const minCapNum = Number(minCapacity);
            content = content.filter(r => r.capacity >= minCapNum);
          }

          this.rooms = content;
          this.totalElements = page.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRooms();
  }
}
