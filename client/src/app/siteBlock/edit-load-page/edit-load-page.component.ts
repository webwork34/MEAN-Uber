import { Subscription } from 'rxjs';
import { Load } from 'src/app/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadsService } from 'src/app/services/loads.service';
import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-load-page',
  templateUrl: './edit-load-page.component.html',
  styleUrls: ['./edit-load-page.component.scss'],
})
export class EditLoadPageComponent implements OnInit, OnDestroy {
  constructor(
    private loadService: LoadsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  loadId: string;
  load: Load = null;
  gSub: Subscription;
  uSub: Subscription;

  message = null;
  colorToggle = null;
  form: FormGroup;

  ngOnInit(): void {
    this.loadId = this.route.snapshot.params.id;
    this.gSub = this.loadService.getLoadById(this.loadId).subscribe(
      ({ load }) => {
        this.load = load;

        this.form = new FormGroup({
          name: new FormControl(this.load.name, [
            Validators.required,
            Validators.minLength(3),
          ]),
          payload: new FormControl(this.load.payload, [
            Validators.required,
            Validators.min(1),
            Validators.max(4000),
            Validators.pattern(/\d/),
          ]),
          pickup_address: new FormControl(this.load.pickup_address, [
            Validators.required,
            Validators.minLength(10),
          ]),
          delivery_address: new FormControl(this.load.delivery_address, [
            Validators.required,
            Validators.minLength(10),
          ]),
          width: new FormControl(this.load.dimensions.width, [
            Validators.required,
            Validators.min(1),
            Validators.max(700),
            Validators.pattern(/\d/),
          ]),
          length: new FormControl(this.load.dimensions.length, [
            Validators.required,
            Validators.min(1),
            Validators.max(350),
            Validators.pattern(/\d/),
          ]),
          height: new FormControl(this.load.dimensions.height, [
            Validators.required,
            Validators.min(1),
            Validators.max(200),
            Validators.pattern(/\d/),
          ]),
        });
      },
      (err) => {
        this.message = err.error.message;
        this.colorToggle = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.gSub) {
      this.gSub.unsubscribe();
    }

    if (this.uSub) {
      this.uSub.unsubscribe();
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

    this.uSub = this.loadService.updateLoadById(this.loadId, load).subscribe(
      ({ message }) => {
        this.colorToggle = true;
        this.message = message;

        setTimeout(() => {
          this.message = null;
          this.form.reset();
          this.form.enable();
          this.router.navigate(['/new-loads']);
        }, 1500);
      },
      (err) => {
        this.message = err.error.message;
        this.form.enable();

        setTimeout(() => {
          this.message = null;
        }, 2000);
      }
    );
  }
}
