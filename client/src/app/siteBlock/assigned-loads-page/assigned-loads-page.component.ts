import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Load } from 'src/app/interfaces';
import { LoadsService } from 'src/app/services/loads.service';
import { Router } from '@angular/router';
import { faEye, faStepForward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-assigned-loads-page',
  templateUrl: './assigned-loads-page.component.html',
  styleUrls: ['./assigned-loads-page.component.scss'],
})
export class AssignedLoadsPageComponent implements OnInit, OnDestroy {
  constructor(private loadsService: LoadsService, private router: Router) {}

  faEye = faEye;
  faStepForward = faStepForward;

  data: any;
  fSub: Subscription;
  nSub: Subscription;
  message: string = null;
  assignMessage: string = null;
  isDriver = false;
  isShipper = false;
  colorToggle: boolean;

  fetchLoad() {
    this.fSub = this.loadsService.fetchLoads().subscribe(
      (data) => {
        const role = localStorage.getItem('role');

        if (role === 'SHIPPER') {
          this.isShipper = true;

          this.data = data[0].loads.filter(
            (load: Load) => load.status === 'ASSIGNED'
          );
        } else {
          this.isDriver = true;

          this.data = data.loads.filter(
            (load: Load) => load.status === 'ASSIGNED'
          );
        }

        if (this.data.length === 0) {
          this.assignMessage = 'No ASSIGNED loads';
        }
      },
      (err) => {
        this.colorToggle = false;
        this.message = err.error.message;
        this.assignMessage = 'No ASSIGNED loads';
      }
    );
  }

  ngOnInit(): void {
    this.fetchLoad();
  }

  ngOnDestroy() {
    if (this.fSub) {
      this.fSub.unsubscribe();
    }

    if (this.nSub) {
      this.nSub.unsubscribe();
    }
  }

  showLoadInfo(i: string) {
    const loadId = this.data[i]._id;

    this.router.navigate([`/loads/${loadId}/shipping-info`]);
  }

  nextLevel() {
    this.fSub.unsubscribe();
    if (this.nSub) {
      this.nSub.unsubscribe();
    }

    this.nSub = this.loadsService.nextLoadState().subscribe(
      (data) => {
        this.fetchLoad();
        this.colorToggle = true;
        this.message = data.message;

        setTimeout(() => {
          this.colorToggle = null;
          this.message = null;
        }, 1500);
      },
      (err) => {
        this.colorToggle = false;
        this.message = err.error.message;

        setTimeout(() => {
          this.colorToggle = null;
          this.message = null;
        }, 2000);
      }
    );
  }
}
