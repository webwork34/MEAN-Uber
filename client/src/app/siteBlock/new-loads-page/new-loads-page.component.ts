import { Router } from '@angular/router';
import { LoadsService } from './../../services/loads.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Load } from 'src/app/interfaces';
import { Subscription } from 'rxjs';
import {
  faPencilAlt,
  faArrowCircleUp,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-loads-page',
  templateUrl: './new-loads-page.component.html',
  styleUrls: ['./new-loads-page.component.scss'],
})
export class NewLoadsPageComponent implements OnInit, OnDestroy {
  constructor(private loadsService: LoadsService, private router: Router) {}

  faPencilAlt = faPencilAlt;
  faArrowCircleUp = faArrowCircleUp;
  faEye = faEye;
  faTrashAlt = faTrashAlt;

  data: any;
  message = null;
  dataMessage = null;
  colorToggle: boolean;
  displayToggle = true;
  fSub: Subscription;
  sSub: Subscription;
  dSub: Subscription;

  fetchLoads() {
    this.fSub = this.loadsService.fetchLoads().subscribe(
      (data) => {
        this.data = data[0].loads.filter((load: Load) => load.status === 'NEW');

        if (this.data.length === 0) {
          this.dataMessage = 'No NEW loads';
        }
      },
      (err) => {
        if (err.status === 404) {
          this.data = null;
          this.dataMessage = 'No NEW loads';
        } else {
          this.message = err.error.message;
        }
      }
    );
  }

  ngOnInit(): void {
    this.fetchLoads();
  }

  ngOnDestroy() {
    if (this.fSub) {
      this.fSub.unsubscribe();
    }

    if (this.sSub) {
      this.sSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }

  showLoadInfo(i: string) {
    const loadId = this.data[i]._id;

    this.router.navigate([`/loads/${loadId}`]);
  }

  editLoad(i: string) {
    const loadId = this.data[i]._id;

    this.router.navigate([`/loads/${loadId}/edit`]);
  }

  driverSearching(i: string) {
    this.displayToggle = false;
    const loadId = this.data[i]._id;

    this.sSub = this.loadsService.postLoadById(loadId).subscribe(
      ({ message }) => {
        this.fSub.unsubscribe();
        this.fetchLoads();

        this.colorToggle = true;
        this.message = message;

        setTimeout(() => {
          this.message = null;
          this.displayToggle = true;
        }, 1500);
      },
      (err) => {
        this.message = err.error.message;
        this.colorToggle = false;

        setTimeout(() => {
          this.message = null;
          this.displayToggle = true;
        }, 2000);
      }
    );
  }

  delete(i: string) {
    const loadId = this.data[i]._id;
    this.displayToggle = false;

    this.dSub = this.loadsService.deleteLoadById(loadId).subscribe(
      ({ message }) => {
        this.fSub.unsubscribe();
        this.fetchLoads();
        this.colorToggle = true;
        this.message = message;

        setTimeout(() => {
          this.message = null;
          this.displayToggle = true;
        }, 1500);
      },
      (err) => {
        this.colorToggle = false;
        this.message = err.error.message;

        setTimeout(() => {
          this.message = null;
          this.displayToggle = true;
        }, 2000);
      }
    );
  }
}
