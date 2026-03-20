import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from '../config';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private http = inject(HttpClient);
  private apiUrl = getApiUrl() + '/drivers';

  constructor() { }

  getDrivers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createDriver(driverData: any) {
    return this.http.post<any>(this.apiUrl, driverData);
  }

  updateDriver(id: string, driverData: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, driverData);
  }

  deleteDriver(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
