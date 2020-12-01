import { LoadsService } from 'src/app/services/loads.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-load-page',
  templateUrl: './load-page.component.html',
  styleUrls: ['./load-page.component.scss'],
})
export class LoadPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private loadsService: LoadsService
  ) {}

  loadId = null;
  load = null;
  errMessage = null;
  logs = null;

  ngOnInit(): void {
    this.loadId = this.route.snapshot.params.id;

    this.loadsService.getLoadById(this.loadId).subscribe(
      ({ load }) => {
        this.load = load;
        this.logs = load.logs;
      },
      (err) => {
        this.errMessage = err.error.message;
      }
    );
  }
}
