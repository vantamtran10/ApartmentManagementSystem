import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {QueryService} from "../../../core/service/query/query.service";

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss']
})
export class MaintenanceRequestsComponent implements OnInit {

  list: Observable<any[]> | undefined;
  constructor(public query: QueryService) {
    query.TENANTGetMaintenanceRequests().subscribe(x =>{
      // @ts-ignore
      this.list = x.valueChanges();
    })
  }

  ngOnInit(): void {
  }
}
