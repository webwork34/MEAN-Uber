import { ActivatedRoute } from '@angular/router';
import { User } from './../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwt_token = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  register(user: User): Observable<User> {
    return this.http.post<User>('api/auth/register', user);
  }

  login(user: User): Observable<{ jwt_token: string }> {
    return (
      this.http
        .post<{ jwt_token: string }>('/api/auth/login', user)

        // в метод pipe можно передавать операторы, которые будут вызываться по
        // цепочке, когда будет рабоать стрим
        .pipe(
          // оператор tap - позволяет выцепить что-то из стрима
          tap(({ jwt_token }) => {
            const parseJwt = (token: string) => {
              try {
                return JSON.parse(atob(token.split('.')[1]));
              } catch (e) {
                return null;
              }
            };

            const role = parseJwt(jwt_token).role;

            localStorage.setItem('auth-token', jwt_token);
            localStorage.setItem('role', role);
            this.setToken(jwt_token);
          })
        )
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>('api/auth/reset_password', email).pipe(
      tap(({ reset_token }) => {
        localStorage.setItem('reset_token', reset_token);
      })
    );
  }

  createNewPassword(data: object): Observable<any> {
    return this.http.post<any>('api/auth/create_newPassword', data);
  }

  setToken(token: string) {
    this.jwt_token = token;
  }

  getToken(): string {
    return this.jwt_token;
  }

  isAuthenticated(): boolean {
    return !!this.jwt_token;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }

  isValidResetToken(): boolean {
    const token = localStorage.getItem('reset_token');
    return !!token;
  }

  isShipper(): boolean {
    const role = localStorage.getItem('role');

    if (role === 'DRIVER') {
      return false;
    }

    return true;
  }
}
