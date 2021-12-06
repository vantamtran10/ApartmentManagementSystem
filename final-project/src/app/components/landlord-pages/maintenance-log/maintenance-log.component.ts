import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";

@Component({
  selector: 'app-maintenance-log',
  templateUrl: './maintenance-log.component.html',
  styleUrls: ['./maintenance-log.component.scss']
})
export class MaintenanceLogComponent implements OnInit {
  logs: any;
  constructor(public queryService: QueryService) { }

  ngOnInit(): void {
    this.queryService.LANDLORDGetAllMaintenanceLog().subscribe(x => {
      this.logs = [];
      x.forEach((data: any) => {
        let t = data;
        console.log(t);
        t.room.get().then((y: any) => {
          t.room = y.data().room;
          this.logs.push(t);
        });
      })
    })
  }
  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
