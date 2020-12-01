import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TrucksService } from 'src/app/services/trucks.service';

@Component({
  selector: 'app-update-truck-page',
  templateUrl: './update-truck-page.component.html',
  styleUrls: ['./update-truck-page.component.scss'],
})
export class UpdateTruckPageComponent implements OnInit {
  constructor(
    private truckService: TrucksService,
    private route: ActivatedRoute
  ) {}

  form: FormGroup;
  uSub: Subscription;
  error = false;
  success = false;
  errMessage = null;
  message = null;
  truckId = null;

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl('SPRINTER'),
    });

    this.truckId = this.route.snapshot.params.id;
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();

    this.uSub = this.truckService
      .updateTruck(this.truckId, this.form.value)
      .subscribe(
        ({ message }) => {
          this.message = message;
          this.success = true;

          setTimeout(() => {
            this.success = false;
            this.form.enable();
          }, 1500);
        },
        (err) => {
          this.error = true;
          this.errMessage = err.error.message;

          setTimeout(() => {
            this.error = false;
            this.form.enable();
          }, 2000);
        }
      );
  }
}
