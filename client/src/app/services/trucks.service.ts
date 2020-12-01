import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Truck } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TrucksService {
  constructor(private http: HttpClient) {}

  fetchTrucks(): Observable<Truck> {
    return this.http.get<Truck>('/api/trucks');
  }

  createTruck(truck: Truck): Observable<Truck> {
    return this.http.post<Truck>('/api/trucks', truck);
  }

  assignTruckToUser(id: string): Observable<any> {
    return this.http.post<any>(`/api/trucks/${id}/assign`, null);
  }

  unAssignTruckFromUser(id: string): Observable<any> {
    return this.http.post<any>(`/api/trucks/${id}/unassign`, null);
  }

  deleteTruck(id: string): Observable<any> {
    return this.http.delete<any>(`/api/trucks/${id}`);
  }

  updateTruck(id: string, type: string): Observable<any> {
    return this.http.put<any>(`/api/trucks/${id}`, type);
  }
}
