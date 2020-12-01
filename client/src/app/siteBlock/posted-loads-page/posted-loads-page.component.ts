import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Load } from 'src/app/interfaces';
import { LoadsService } from 'src/app/services/loads.service';

@Component({
  selector: 'app-posted-loads-page',
  templateUrl: './posted-loads-page.component.html',
  styleUrls: ['./posted-loads-page.component.scss'],
})
export class PostedLoadsPageComponent implements OnInit, OnDestroy {
  constructor(private loadsService: LoadsService) {}

  data: any;
  fSub: Subscription;
  message: string = null;

  ngOnInit(): void {
    this.fSub = this.loadsService.fetchLoads().subscribe(
      (data) => {
        this.data = data[0].loads.filter(
          (load: Load) => load.status === 'POSTED'
        );

        if (this.data.length === 0) {
          this.message = 'No POSTED loads';
        }
      },
      (err) => {
        this.message = err.error.message;
      }
    );
  }

  ngOnDestroy() {
    if (this.fSub) {
      this.fSub.unsubscribe();
    }
  }
}
