import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TrucksService } from 'src/app/services/trucks.service';

@Component({
  selector: 'app-create-new-truck-page',
  templateUrl: './create-new-truck-page.component.html',
  styleUrls: ['./create-new-truck-page.component.scss'],
})
export class CreateNewTruckPageComponent implements OnInit, OnDestroy {
  constructor(private truckService: TrucksService) {}

  form: FormGroup;
  cSub: Subscription;
  error = false;
  success = false;
  errMessage = null;

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl('SPRINTER'),
    });
  }

  ngOnDestroy() {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();

    this.cSub = this.truckService.createTruck(this.form.value).subscribe(
      () => {
        this.success = true;

        setTimeout(() => {
          this.success = false;
          this.form.enable();
        }, 1000);
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
