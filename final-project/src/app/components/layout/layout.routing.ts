import { RoomsComponent } from './../tenant-pages/rooms/rooms.component';
import { Routes } from '@angular/router';
import { AuthGuard } from "../../core/guard/auth.guard";

import { TenantsDashboardComponent } from "../tenant-pages/tenants-dashboard/tenants-dashboard.component";
import { MaintenanceRequestsComponent } from "../tenant-pages/maintenance-requests/maintenance-requests.component";

export const LayoutRoutes: Routes = [
  { path: 'tenants', component: TenantsDashboardComponent, canActivate: [AuthGuard]},
  { path: 'maintenance-requests', component: MaintenanceRequestsComponent, canActivate: [AuthGuard]},
  { path: 'rooms', component: RoomsComponent}
];
