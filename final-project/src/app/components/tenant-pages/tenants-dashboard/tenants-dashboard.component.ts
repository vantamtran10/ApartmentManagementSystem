import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../core/service/auth/auth.service";

@Component({
  selector: 'app-tenants-dashboard',
  templateUrl: './tenants-dashboard.component.html',
  styleUrls: ['./tenants-dashboard.component.scss']
})
export class TenantsDashboardComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
