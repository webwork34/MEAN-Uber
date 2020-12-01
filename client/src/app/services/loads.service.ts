import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Load } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class LoadsService {
  constructor(private http: HttpClient) {}

  fetchLoads(): Observable<any> {
    return this.http.get<any>('/api/loads');
  }

  getLoadById(id: string): Observable<any> {
    return this.http.get<any>(`/api/loads/${id}`);
  }

  showShippingInfo(id: string): Observable<any> {
    return this.http.get<any>(`/api/loads/${id}/shipping_info`);
  }

  createLoad(load: Load): Observable<Load> {
    return this.http.post<Load>('/api/loads', load);
  }

  postLoadById(id: string): Observable<any> {
    return this.http.post<any>(`/api/loads/${id}/post`, null);
  }

  updateLoadById(id: string, load: Load): Observable<any> {
    return this.http.put<any>(`/api/loads/${id}`, load);
  }

  deleteLoadById(id: string): Observable<any> {
    return this.http.delete<any>(`/api/loads/${id}`);
  }

  nextLoadState(): Observable<any> {
    return this.http.patch<any>('/api/loads/active/state', null);
  }
}
