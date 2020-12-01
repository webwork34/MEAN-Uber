import { Subscription } from 'rxjs';
import { HistoryService } from './../../services/history.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadsService } from 'src/app/services/loads.service';
import { Load } from 'src/app/interfaces';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  constructor(
    private historyService: HistoryService,
    private loadsService: LoadsService
  ) {}

  hSub: Subscription;
  fSub: Subscription;
  logs = null;
  data: any;
  message: string = null;

  ngOnInit(): void {
    this.fSub = this.loadsService.fetchLoads().subscribe(
      (data) => {
        const role = localStorage.getItem('role');

        if (role === 'SHIPPER') {
          this.data = data[0].loads.filter(
            (load: Load) => load.status === 'SHIPPED'
          );
        } else {
          this.data = data.loads.filter(
            (load: Load) => load.status === 'SHIPPED'
          );
        }

        if (this.data.length === 0) {
          this.message = 'No SHIPPED loads';
        }
      },
      (err) => {
        this.message = err.error.message;
      }
    );

    this.hSub = this.historyService.fetchHisory().subscribe(
      ({ logs }) => {
        this.logs = logs;
      },
      (err) => (this.message = err.error.message)
    );
  }

  ngOnDestroy() {
    if (this.hSub) {
      this.hSub.unsubscribe();
    }

    if (this.fSub) {
      this.fSub.unsubscribe();
    }
  }
}
