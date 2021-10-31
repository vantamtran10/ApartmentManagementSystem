import { Component, OnInit } from '@angular/core';
import { QueryService } from "../../../core/service/query/query.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-tenants-dashboard',
  templateUrl: './tenants-dashboard.component.html',
  styleUrls: ['./tenants-dashboard.component.scss']
})
export class TenantsDashboardComponent implements OnInit {
  neighbors: any;
  Object = Object;
  subject = new FormControl('');
  description = new FormControl('');
  errorMessage: string | undefined;
  successMessage: string | undefined;
  constructor(public queryService: QueryService) { }

  ngOnInit(): void {
    this.neighbors = {};
    this.queryService.TENANTGetNeighbors().subscribe(data => {
      this.neighbors[data.id] = data;
    });
  }

  createMaintenanceRequest(): void{
    this.queryService.TENANTCreateMaintenanceRequest(this.subject.value, this.description.value).then(r => {
      this.errorMessage = '';
      // @ts-ignore
      this.successMessage = r;
    }).catch(e => {
      this.successMessage = '';
      this.errorMessage = e;
    });
  }
}
