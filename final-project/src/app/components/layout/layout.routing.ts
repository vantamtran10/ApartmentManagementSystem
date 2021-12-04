
import { Routes } from '@angular/router';
import { AuthGuard } from "../../core/guard/auth.guard";

import { TenantsDashboardComponent } from "../tenant-pages/tenants-dashboard/tenants-dashboard.component";
import { MaintenanceRequestsComponent } from "../tenant-pages/maintenance-requests/maintenance-requests.component";
import { ChatComponent } from "../tenant-pages/chat/chat.component";
import { LandlordDashboardComponent } from "../landlord-pages/landlord-dashboard/landlord-dashboard.component";
import {MaintenanceDashboardComponent} from "../maintenance-pages/maintenance-dashboard/maintenance-dashboard.component";

export const LayoutRoutes: Routes = [
  { path: 'tenants', component: TenantsDashboardComponent, canActivate: [AuthGuard]},
  { path: 'landlords', component: LandlordDashboardComponent, canActivate: [AuthGuard]},
  { path: 'maintenance', component: MaintenanceDashboardComponent, canActivate: [AuthGuard]},
  { path: 'maintenance-requests', component: MaintenanceRequestsComponent, canActivate: [AuthGuard]},
  { path: 'chat', component: ChatComponent}
];
