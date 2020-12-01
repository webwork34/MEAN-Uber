import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss'],
})
export class PasswordPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error = false;
  npSub: Subscription;
  errMessage = null;
  token: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.token = this.route.snapshot.params.token;
  }

  ngOnDestroy() {
    if (this.npSub) {
      this.npSub.unsubscribe();
    }

    this.error = false;
    this.errMessage = null;
  }

  onSubmit() {
    this.form.disable();

    const data = {
      password: this.form.value.password,
      token: this.token,
    };

    this.npSub = this.authService.createNewPassword(data).subscribe(
      () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      (err) => {
        this.error = true;
        this.errMessage = err.error.message;
        this.form.enable();
      }
    );
  }
}
