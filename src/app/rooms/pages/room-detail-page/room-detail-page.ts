import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-detail-page',
  standalone: false,
  templateUrl: './room-detail-page.html',
  styleUrl: './room-detail-page.scss',
})
export class RoomDetailPage implements OnInit {
  room: Room | null = null;
  loadingRoom = false;
  creating = false;

  nights: number | null = null;
  totalPrice: number | null = null;


  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  //Validacion de formulario / Formulario reactivo
  form = this.fb.group({
    checkIn: [null as Date | null, [Validators.required]],
    checkOut: [null as Date | null, [Validators.required]],
  }, {
    validators: [dateRangeValidator],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/rooms']);
      return;
    }

    this.loadRoom(id);

    this.form.valueChanges.subscribe(() => {
      this.updatePricePreview();
    });
  }

  // Carga de datos de la habitación y actualiza precios
  loadRoom(id: string): void {
    this.loadingRoom = true;
    this.roomService.getRoomById(id).subscribe({
      next: (room) => {
        this.room = room;
        this.loadingRoom = false;
        this.updatePricePreview();
      },
      error: () => {
        this.loadingRoom = false;
        this.router.navigate(['/rooms']);
      },
    });
  }

  updatePricePreview(): void {
    if (!this.room) {
      this.nights = null;
      this.totalPrice = null;
      return;
    }

    const checkIn = this.form.value.checkIn;
    const checkOut = this.form.value.checkOut;

    if (checkIn && checkOut && checkOut > checkIn) {
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      this.nights = diffDays;
      this.totalPrice = this.room.pricePerNight * diffDays;
    } else {
      this.nights = null;
      this.totalPrice = null;
    }
  }

  submitReservation(): void {
    if (!this.room) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Revisa las fechas seleccionadas', 'Cerrar', { duration: 2500 });
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para reservar una habitación.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ir a iniciar sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/auth'], {
            queryParams: { returnUrl: this.router.url },
          });
        }
      });

      return;
    }

    const checkIn = this.form.value.checkIn!;
    const checkOut = this.form.value.checkOut!;

    const payload = {
      roomId: this.room.id,
      userId: userId,
      checkInDate: checkIn.toISOString().substring(0, 10),  // yyyy-MM-dd
      checkOutDate: checkOut.toISOString().substring(0, 10),
    };

    this.creating = true;

    //Modal de confirmacion de reservacion
    Swal.fire({
      title: 'Confirmar reservación',
      text: '¿Deseas confirmar esta reservación con las fechas seleccionadas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reservar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) {
        return; // si el usuario cancela, no hacer nada
      }

      this.creating = true;

      this.reservationService.createReservation(payload).subscribe({
        next: () => {
          this.creating = false;

          Swal.fire({
            title: '¡Reserva creada!',
            text: 'La reservación se ha registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#3085d6',
            timer: 1500,
            timerProgressBar: true
          }).then(() => this.router.navigate(['/reservations']));
        },

        error: () => {
          this.creating = false;

          Swal.fire({
            title: 'Habitación no disponible',
            text: 'La habitación no se encuentra disponible en las fechas seleccionadas.',
            icon: 'info',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#d33',
          });
        }
      });

    });
  }
}

/** Validador de rango de fechas: salida > entrada */
export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as any;
  const checkIn: Date | null = group.get('checkIn')?.value;
  const checkOut: Date | null = group.get('checkOut')?.value;

  if (!checkIn || !checkOut) {
    return null;
  }

  if (checkOut <= checkIn) {
    return { dateRange: 'La fecha de salida debe ser posterior a la de entrada' };
  }

  return null;
}
