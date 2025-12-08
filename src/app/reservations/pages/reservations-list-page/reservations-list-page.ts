import { Component, inject, OnInit } from '@angular/core';
import { Reservation } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { catchError, Observable, of, Subject, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';

//Componente de reservaciones y sus metodos correspondientes
@Component({
  selector: 'app-reservations-list-page',
  standalone: false,
  templateUrl: './reservations-list-page.html',
  styleUrl: './reservations-list-page.scss',
})

export class ReservationsListPage implements OnInit {
  reservations: Reservation[] = [];
  loading = false;

  // Para edición
  editForms = new Map<string, FormGroup>();
  editingId: string | null = null;
  updating = false;

  // Trigger para recargar (RxJS)
  private reload$ = new Subject<void>();

  displayedColumns = ['roomId', 'dates', 'total', 'status', 'actions'];

  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.reload$
      .pipe(
        switchMap(() => this.loadReservations())
      )
      .subscribe();

    // primer load
    this.reload$.next();
  }

  // Cambia la firma del método
  loadReservations(): Observable<Reservation[]> {
    this.loading = true;
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.loading = false;
      this.snackBar.open('Debes iniciar sesión para ver tus reservas', 'Cerrar', {
        duration: 3000,
      });
      this.reservations = [];
      // Devuelve un Observable que emite un array vacío y se completa
      return of([]);
    }

    return this.reservationService.getReservationsByUser(userId).pipe(
      tap(reservations => {
        this.reservations = reservations;
        this.setupForms();
        this.loading = false;
      }),
      catchError(err => {
        console.error('Error cargando reservas:', err);
        this.loading = false;
        this.snackBar.open('Error al cargar tus reservas', 'Cerrar', {
          duration: 4000,
        });
        this.reservations = [];
        // Importante: devolver un Observable aunque haya error
        return of([]); // o return EMPTY; si prefieres que no emita nada
      })
    );
  }

  setupForms(): void {
    this.editForms.clear();
    this.reservations.forEach(r => {
      const form = this.fb.group({
        checkIn: [new Date(r.checkInDate), [Validators.required]],
        checkOut: [new Date(r.checkOutDate), [Validators.required]],
      }, {
        validators: [dateRangeValidator],
      });

      this.editForms.set(r.id, form);
    });
  }

  getForm(id: string): FormGroup | null {
    return this.editForms.get(id) ?? null;
  }

  startEdit(id: string): void {
    this.editingId = id;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveChanges(reservation: Reservation): void {
    const form = this.getForm(reservation.id);
    if (!form) return;

    if (form.invalid) {
      form.markAllAsTouched();
      this.snackBar.open('Revisa las fechas seleccionadas', 'Cerrar', { duration: 2500 });
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.snackBar.open('Debes iniciar sesión', 'Cerrar', { duration: 2500 });
      return;
    }

    const checkIn = form.value.checkIn as Date;
    const checkOut = form.value.checkOut as Date;

    const payload = {
      roomId: reservation.roomId,
      userId: userId,
      checkInDate: checkIn.toISOString().substring(0, 10),
      checkOutDate: checkOut.toISOString().substring(0, 10),
    };

    this.updating = true;

    this.reservationService.updateReservation(reservation.id, payload).subscribe({
      next: () => {
        this.updating = false;
        this.editingId = null;

        Swal.fire({
          title: 'Reserva actualizada',
          text: 'Los cambios han sido guardados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
          timer: 2000
        });

        this.reload$.next();
      },
      error: () => {
        this.updating = false;

        Swal.fire({
          title: 'Ocurrió un error',
          text: 'No se pudo actualizar la reserva.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#d33'
        });
      },
    });
  }

  cancelReservation(id: string): void {
    Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Reserva cancelada',
            text: 'La reserva ha sido cancelada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });

          this.reload$.next();
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cancelar la reserva.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        },
      });
    });
  }

  checkout(reservation: Reservation): void {
    Swal.fire({
      title: '¿Finalizar reserva?',
      text: 'Se realizará el checkout de esta reserva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.reservationService.checkoutReservation(reservation.id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Reserva finalizada',
            text: 'El checkout se ha realizado correctamente.',
            icon: 'success',
            timer: 2000,
            confirmButtonText: 'Aceptar',
          });

          this.reload$.next();
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo completar el checkout.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
        },
      });
    });
  }

  isEditable(reservation: Reservation): boolean {
    return reservation.status !== 'CANCELLED' && reservation.status !== 'CHECKED_OUT';
  }
}

/** Validador de rango de fechas (igual que en detalle de habitación) */
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
