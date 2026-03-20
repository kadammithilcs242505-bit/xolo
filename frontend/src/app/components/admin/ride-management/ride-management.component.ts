import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RideService } from '../../../services/ride.service';
import { DriverService } from '../../../services/driver.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ride-management.component.html',
  styleUrl: './ride-management.component.scss'
})
export class RideManagementComponent implements OnInit {
  rideService = inject(RideService);
  driverService = inject(DriverService);
  authService = inject(AuthService);
  router = inject(Router);

  rides: any[] = [];
  availableDrivers: any[] = [];
  selectedDriver: any = {};

  ngOnInit() {
    this.loadRides();
    this.loadDrivers();
  }

  loadRides() {
    this.rideService.getRides().subscribe((res) => {
      this.rides = res;
    });
  }

  loadDrivers() {
    this.driverService.getDrivers().subscribe((res) => {
      this.availableDrivers = res.filter(d => d.status === 'available');
    });
  }

  updateRideStatus(rideId: string, status: string, event: Event) {
    let payload: any = { rideStatus: status };

    if (status === 'accepted') {
      const driverId = this.selectedDriver[rideId];
      if (!driverId) {
        alert('Please assign a driver before accepting the ride.');
        event.preventDefault();
        return;
      }
      payload.driverId = driverId;
    }

    this.rideService.updateRideStatus(rideId, payload).subscribe(() => {
      this.loadRides();
      this.loadDrivers();
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
