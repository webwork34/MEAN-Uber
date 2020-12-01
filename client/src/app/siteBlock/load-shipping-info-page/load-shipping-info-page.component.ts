import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadsService } from 'src/app/services/loads.service';

@Component({
  selector: 'app-load-shipping-info-page',
  templateUrl: './load-shipping-info-page.component.html',
  styleUrls: ['./load-shipping-info-page.component.scss'],
})
export class LoadShippingInfoPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private loadsService: LoadsService
  ) {}

  loadId = null;
  load = null;
  truck = null;
  driver = null;
  errMessage = null;
  logs = null;

  ngOnInit(): void {
    this.loadId = this.route.snapshot.params.id;

    this.loadsService.showShippingInfo(this.loadId).subscribe(
      ({ load, truck, driver }) => {
        this.load = load;
        this.truck = truck;
        this.driver = driver;
        this.logs = load.logs;
      },
      (err) => {
        this.errMessage = err.error.message;
      }
    );
  }
}
