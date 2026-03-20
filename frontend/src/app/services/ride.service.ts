import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from '../config';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private http = inject(HttpClient);
  private apiUrl = getApiUrl() + '/rides';

  constructor() { }

  bookRide(rideData: any) {
    return this.http.post<any>(this.apiUrl, rideData);
  }

  getRides() {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateRideStatus(id: string, data: { rideStatus: string, driverId?: string }) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }
}
