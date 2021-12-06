import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";
import {Observable} from "rxjs/Observable";
import {fromArray} from "rxjs-compat/observable/fromArray";

@Component({
  selector: 'app-maintenance-dashboard',
  templateUrl: './maintenance-dashboard.component.html',
  styleUrls: ['./maintenance-dashboard.component.scss']
})
export class MaintenanceDashboardComponent implements OnInit {
  Object = Object;
  countMaintenance:number = 0;
  list:any;

  constructor(public queryService: QueryService) {
    this.queryService.COUNTMaintenanceRequests().subscribe( x => {
      this.countMaintenance = x.size;
    });


  }

  ngOnInit(): void {
    this.list = {};
    // maintenance users
    this.queryService.getInfoUsers().subscribe( x => {
      console.log(x);
      // @ts-ignore
      this.list[x.id] = x;
      //console.log(this.list);
      //this.list = x.valueChanges;
    });

  }


}
