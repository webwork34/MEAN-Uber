import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadsService } from 'src/app/services/loads.service';
import { Load } from 'src/app/interfaces';

@Component({
  selector: 'app-create-new-load-page',
  templateUrl: './create-new-load-page.component.html',
  styleUrls: ['./create-new-load-page.component.scss'],
})
export class CreateNewLoadPageComponent implements OnInit, OnDestroy {
  constructor(private loadService: LoadsService) {}

  form: FormGroup;
  cSub: Subscription;
  error = false;
  success = false;
  errMessage = null;

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      payload: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(4000),
        Validators.pattern(/\d/),
      ]),
      pickup_address: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      delivery_address: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      width: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(700),
        Validators.pattern(/\d/),
      ]),
      length: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(350),
        Validators.pattern(/\d/),
      ]),
      height: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(200),
        Validators.pattern(/\d/),
      ]),
    });
  }

  ngOnDestroy() {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();

    const dimensions = {
      width: this.form.value.width,
      length: this.form.value.length,
      height: this.form.value.height,
    };

    const load: Load = {
      pickup_address: this.form.value.pickup_address,
      delivery_address: this.form.value.delivery_address,
      name: this.form.value.name,
      payload: this.form.value.payload,
      dimensions,
    };

    this.cSub = this.loadService.createLoad(load).subscribe(
      () => {
        this.success = true;
        this.form.reset();
        this.form.enable();

        setTimeout(() => {
          this.success = false;
        }, 1500);
      },
      (err) => {
        this.error = true;
        this.errMessage = err.error.message;
        this.form.enable();

        setTimeout(() => {
          this.error = false;
        }, 2000);
      }
    );
  }
}
