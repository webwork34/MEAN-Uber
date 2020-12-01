import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../../services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  changeSub: Subscription;
  toggle: Boolean;
  message: string = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      oldPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnDestroy() {
    if (this.changeSub) {
      this.changeSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.changeSub = this.userService.changePassword(this.form.value).subscribe(
      ({ message }) => {
        this.toggle = true;
        this.message = message;
        this.form.reset();
        this.form.enable();

        setTimeout(() => {
          this.message = null;
        }, 1500);
      },
      (err) => {
        this.toggle = false;
        this.message = err.error.message;
        this.form.reset();
        this.form.enable();

        setTimeout(() => {
          this.message = null;
        }, 2000);
      }
    );
  }
}
