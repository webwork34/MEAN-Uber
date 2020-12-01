import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  aSub: Subscription;
  error = false;
  errMessage = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }

    this.error = false;
    this.errMessage = null;
  }

  onSubmit() {
    this.form.disable();

    this.aSub = this.authService.login(this.form.value).subscribe(
      () => this.router.navigate(['/profile']),
      (err) => {
        this.error = true;
        this.errMessage = err.error.message;
        this.form.enable();

        setTimeout(() => {
          this.error = false;
        }, 4000);
      }
    );
  }
}
