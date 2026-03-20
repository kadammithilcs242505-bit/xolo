import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RideService } from '../../../services/ride.service';
import { AuthService } from '../../../services/auth.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-ride-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './ride-booking.component.html',
  styleUrl: './ride-booking.component.scss'
})
export class RideBookingComponent implements OnInit {
  rideService = inject(RideService);
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  bookingForm = this.fb.group({
    pickupLocation: ['', Validators.required],
    dropLocation: ['', Validators.required],
    fare: [0]
  });

  isCalculating = false;
  estimatedFare: number | null = null;
  totalDistance: string | null = null;
  bookingSuccess = false;
  lastFocusedField: 'pickup' | 'drop' | null = null;

  // Google Maps Properties
  center: google.maps.LatLngLiteral = { lat: 28.6139, lng: 77.2090 }; // Delhi
  zoom = 12;

  pickupMarker: google.maps.LatLngLiteral | null = null;
  dropMarker: google.maps.LatLngLiteral | null = null;

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }]
      }
    ]
  };

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = { lat: position.coords.latitude, lng: position.coords.longitude };
        }
      );
    }
  }

  handleMapClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;
    const coords = event.latLng.toJSON();
    const posLabel = `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`;

    if (this.lastFocusedField === 'pickup') {
      this.pickupMarker = coords;
      this.bookingForm.patchValue({ pickupLocation: posLabel });
    } else if (this.lastFocusedField === 'drop') {
      this.dropMarker = coords;
      this.bookingForm.patchValue({ dropLocation: posLabel });
    } else {
      // Default behavior if nothing focused
      if (!this.pickupMarker) {
        this.pickupMarker = coords;
        this.bookingForm.patchValue({ pickupLocation: posLabel });
      } else {
        this.dropMarker = coords;
        this.bookingForm.patchValue({ dropLocation: posLabel });
      }
    }

    if (this.pickupMarker && this.dropMarker) {
      this.calculateFare();
    }
  }

  resetMap() {
    this.pickupMarker = null;
    this.dropMarker = null;
    this.bookingForm.patchValue({ pickupLocation: '', dropLocation: '' });
    this.estimatedFare = null;
    this.totalDistance = null;
    this.lastFocusedField = null;
  }

  calculateFare() {
    if (this.pickupMarker && this.dropMarker) {
      this.isCalculating = true;

      // Calculate distance using Google Maps Geometry library
      const p1 = new google.maps.LatLng(this.pickupMarker.lat, this.pickupMarker.lng);
      const p2 = new google.maps.LatLng(this.dropMarker.lat, this.dropMarker.lng);

      const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
      const distanceInlineKm = distanceInMeters / 1000;

      this.totalDistance = distanceInlineKm.toFixed(2);

      setTimeout(() => {
        // 10 RS per KM
        this.estimatedFare = Math.max(Math.round(distanceInlineKm * 10), 30); // Min fare 30
        this.bookingForm.patchValue({ fare: this.estimatedFare });
        this.isCalculating = false;
      }, 800);
    }
  }

  confirmBooking() {
    if (this.bookingForm.valid && this.estimatedFare) {
      this.rideService.bookRide(this.bookingForm.value).subscribe({
        next: () => {
          this.bookingSuccess = true;
          this.estimatedFare = null;
          this.totalDistance = null;
          this.bookingForm.reset();
          this.pickupMarker = null;
          this.dropMarker = null;
        },
        error: (err) => {
          alert('Error booking ride: ' + err.message);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
