import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RideService } from '../../../services/ride.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-history.component.html',
  styleUrl: './ride-history.component.scss'
})
export class RideHistoryComponent implements OnInit {
  rideService = inject(RideService);
  authService = inject(AuthService);
  router = inject(Router);

  rides: any[] = [];

  ngOnInit() {
    this.loadRides();
  }

  loadRides() {
    this.rideService.getRides().subscribe({
      next: (res) => {
        this.rides = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  cancellingId: string | null = null;
  isCancelling = false;

  setCancelling(id: string | null) {
    this.cancellingId = id;
  }

  executeCancel(id: string) {
    this.isCancelling = true;
    this.rideService.updateRideStatus(id, { rideStatus: 'cancelled' }).subscribe({
      next: () => {
        this.isCancelling = false;
        this.cancellingId = null;
        this.loadRides();
      },
      error: (err) => {
        this.isCancelling = false;
        this.cancellingId = null;
        alert(err.error?.message || 'Error cancelling ride');
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
