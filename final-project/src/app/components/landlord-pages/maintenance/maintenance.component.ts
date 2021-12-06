import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  staff: any;
  constructor(public queryService: QueryService) { }

  ngOnInit(): void {
    this.queryService.LANDLORDGetAllMaintenanceStaff().subscribe(x => {
      this.staff = x;
    });
  }

}
