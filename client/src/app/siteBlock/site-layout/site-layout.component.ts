import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
})
export class SiteLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  lSub: Subscription;
  isDriver: boolean;
  fSub: Subscription;
  userName: string;
  errMessage: string = null;

  ngOnInit(): void {
    this.fSub = this.userService.fetchData().subscribe(
      ({ user }) => {
        this.userName = user.email;

        if (user.role === 'DRIVER') {
          this.isDriver = true;
        } else {
          this.isDriver = false;
        }
      },
      (err) => {
        this.errMessage = err.error.message;
      }
    );
  }

  ngOnDestroy() {
    if (this.fSub) {
      this.fSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
