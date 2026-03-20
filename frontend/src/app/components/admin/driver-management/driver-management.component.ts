import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './driver-management.component.html',
  styleUrl: './driver-management.component.scss'
})
export class DriverManagementComponent implements OnInit {
  driverService = inject(DriverService);
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  drivers: any[] = [];
  isEdit = false;
  currentDriverId: string | null = null;
  showForm = false;

  driverForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    vehicleNumber: ['', Validators.required],
    vehicleType: ['', Validators.required],
    status: ['available']
  });

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.driverService.getDrivers().subscribe((res) => {
      this.drivers = res;
    });
  }

  onSubmit() {
    if (this.driverForm.valid) {
      if (this.isEdit && this.currentDriverId) {
        this.driverService.updateDriver(this.currentDriverId, this.driverForm.value).subscribe({
          next: () => {
            this.loadDrivers();
            this.resetForm();
          },
          error: (err) => {
            alert('Error updating driver: ' + (err.error?.message || err.message));
          }
        });
      } else {
        this.driverService.createDriver(this.driverForm.value).subscribe({
          next: () => {
            this.loadDrivers();
            this.resetForm();
          },
          error: (err) => {
            alert('Error adding driver: ' + (err.error?.message || err.message));
          }
        });
      }
    }
  }

  editDriver(driver: any) {
    this.isEdit = true;
    this.currentDriverId = driver._id;
    this.showForm = true;
    this.driverForm.patchValue(driver);
  }

  deleteDriver(id: string) {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.driverService.deleteDriver(id).subscribe(() => {
        this.loadDrivers();
      });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.currentDriverId = null;
    this.showForm = false;
    this.driverForm.reset({ status: 'available' });
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
