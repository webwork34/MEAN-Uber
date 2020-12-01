import { ChangePassword } from './../interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    return this.http.get<any>('/api/users/me');
  }

  changePassword(passwords: ChangePassword): Observable<any> {
    return this.http.patch<any>('/api/users/me/password', passwords);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete<any>('/api/users/me');
  }

  addPhoto(image: File): Observable<any> {
    const fd = new FormData();
    fd.append('image', image, image.name);

    return this.http.patch<any>('/api/users/me/change_photo', fd);
  }
}
