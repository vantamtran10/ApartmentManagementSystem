
import { Routes } from '@angular/router';
import { AuthGuard } from "../../core/guard/auth.guard";

import { TenantsDashboardComponent } from "../tenant-pages/tenants-dashboard/tenants-dashboard.component";
import { MaintenanceRequestsComponent } from "../tenant-pages/maintenance-requests/maintenance-requests.component";
import {LandlordDashboardComponent} from "../landlord-pages/landlord-dashboard/landlord-dashboard.component";
import {MaintenanceDashboardComponent} from "../maintenance-pages/maintenance-dashboard/maintenance-dashboard.component";
import {RoomsComponent} from "../landlord-pages/rooms/rooms.component";
import {MaintenanceComponent} from "../landlord-pages/maintenance/maintenance.component";
import {MaintenanceLogComponent} from "../landlord-pages/maintenance-log/maintenance-log.component";

export const LayoutRoutes: Routes = [
  { path: 'tenants', component: TenantsDashboardComponent, canActivate: [AuthGuard]},
  { path: 'landlords', component: LandlordDashboardComponent, canActivate: [AuthGuard]},
  { path: 'maintenance', component: MaintenanceDashboardComponent, canActivate: [AuthGuard]},
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard]}, //only landlords
  { path: 'maintenance-staff', component: MaintenanceComponent, canActivate: [AuthGuard]}, // only landlords
  { path: 'maintenance-logs', component: MaintenanceLogComponent, canActivate: [AuthGuard]}, // only landlords?
  { path: 'maintenance-requests', component: MaintenanceRequestsComponent, canActivate: [AuthGuard]}, //tenants
];
