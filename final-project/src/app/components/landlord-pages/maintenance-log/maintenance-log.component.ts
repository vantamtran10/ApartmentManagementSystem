import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";

@Component({
  selector: 'app-maintenance-log',
  templateUrl: './maintenance-log.component.html',
  styleUrls: ['./maintenance-log.component.scss']
})
export class MaintenanceLogComponent implements OnInit {
  logs: any;
  logsFiltered: any;
  constructor(public queryService: QueryService) { }

  ngOnInit(): void {
    this.queryService.LANDLORDGetAllMaintenanceLog().subscribe(x => {
      this.logs = [];
      x.forEach((data: any) => {
        let t = data;
        t.room.get().then((y: any) => {
          if (y.exists) t.room = y.data().room;
          else t.room = 'Room no longer exists';
          this.logs.push(t);
        });
      })
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "") {
      this.logsFiltered = this.logs.filter((t: any) => {
        return t.details.subject.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
          t.details.description.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
          t.room.toString().toLowerCase().includes(filterValue.trim().toLowerCase()) ||
          t.details.status.toLowerCase().includes(filterValue.trim().toLowerCase());

      });
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
