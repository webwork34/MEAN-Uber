import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrucksService } from 'src/app/services/trucks.service';
import { Truck } from 'src/app/interfaces';

@Component({
  selector: 'app-show-user-trucks-page',
  templateUrl: './show-user-trucks-page.component.html',
  styleUrls: ['./show-user-trucks-page.component.scss'],
})
export class ShowUserTrucksPageComponent implements OnInit, OnDestroy {
  constructor(private trucksService: TrucksService, private router: Router) {}

  trucks: any = null;
  message: string = null;
  errMessage: string = null;
  fSub: Subscription;
  aSub: Subscription;
  dSub: Subscription;
  disable = false;
  colorToggle: boolean;

  fetchData() {
    this.fSub = this.trucksService.fetchTrucks().subscribe(
      (data) => {
        this.trucks = data[0].trucks;

        this.disable = this.trucks.some((truck: Truck) => truck.assigned_to);
      },
      (err) => {
        this.errMessage = err.error.message;
      }
    );
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy() {
    if (this.fSub) {
      this.fSub.unsubscribe();
    }

    if (this.aSub) {
      this.aSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }

  assign(i: string) {
    const truckId = this.trucks[i]._id;

    this.aSub = this.trucksService.assignTruckToUser(truckId).subscribe(
      ({ message }) => {
        this.fSub.unsubscribe();
        this.fetchData();
        this.message = message;

        setTimeout(() => {
          this.message = null;
        }, 1500);
      },
      (err) => {
        this.errMessage = err.error.message;

        setTimeout(() => {
          this.errMessage = null;
        }, 2000);
      }
    );
  }

  unassign(i: string) {
    const truckId = this.trucks[i]._id;

    this.aSub = this.trucksService.unAssignTruckFromUser(truckId).subscribe(
      ({ message }) => {
        this.fSub.unsubscribe();
        this.fetchData();
        this.message = message;

        setTimeout(() => {
          this.message = null;
        }, 1500);
      },
      (err) => {
        this.errMessage = err.error.message;

        setTimeout(() => {
          this.errMessage = null;
        }, 2000);
      }
    );
  }

  delete(i: string) {
    const truckId = this.trucks[i]._id;

    this.dSub = this.trucksService.deleteTruck(truckId).subscribe(
      ({ message }) => {
        this.fSub.unsubscribe();
        this.fetchData();
        this.message = message;

        setTimeout(() => {
          this.message = null;
        }, 1500);
      },
      (err) => {
        this.errMessage = err.error.message;

        setTimeout(() => {
          this.errMessage = null;
        }, 2000);
      }
    );
  }

  goToUpdatePage(i: string) {
    const truckId = this.trucks[i]._id;

    this.router.navigate([`/update-truck/${truckId}`]);
  }
}
