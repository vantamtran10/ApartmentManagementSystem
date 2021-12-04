import { AddroomComponent } from './../chatsystem/addroom/addroom.component';
import { ChatroomsComponent } from '../chatsystem/chatrooms/chatrooms.component';
import { Routes } from '@angular/router';
import { AuthGuard } from "../../core/guard/auth.guard";

import { TenantsDashboardComponent } from "../tenant-pages/tenants-dashboard/tenants-dashboard.component";
import { MaintenanceRequestsComponent } from "../tenant-pages/maintenance-requests/maintenance-requests.component";
import { ChatComponent } from '../chatsystem/chat/chat.component';

export const LayoutRoutes: Routes = [
  { path: 'tenants', component: TenantsDashboardComponent, canActivate: [AuthGuard]},
  { path: 'maintenance-requests', component: MaintenanceRequestsComponent, canActivate: [AuthGuard]},
  { path: 'chatrooms', component: ChatroomsComponent, canActivate: [AuthGuard]},
  { path: 'addroom', component: AddroomComponent, canActivate: [AuthGuard]},
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard]}
];
