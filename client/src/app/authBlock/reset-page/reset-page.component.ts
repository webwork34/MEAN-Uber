import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.scss'],
})
export class ResetPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  rSub: Subscription;
  message = null;
  errMessage = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  ngOnDestroy() {
    if (this.rSub) {
      this.rSub.unsubscribe();
    }
    this.message = null;
  }

  onSubmit() {
    this.form.disable();

    this.rSub = this.authService.resetPassword(this.form.value).subscribe(
      ({ message }) => {
        this.message = message;

        setTimeout(() => {
          this.router.navigate(['/login']);
          this.message = null;
        }, 1500);
      },
      (err) => {
        this.errMessage = err.error.message;
        this.form.enable();

        setTimeout(() => {
          this.errMessage = null;
        }, 2000);
      }
    );
  }
}
