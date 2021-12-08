import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LayoutRoutes} from "./layout.routing";
import {
  DialogNeighborMessage,
  DialogNewMessage,
  TenantsDashboardComponent
} from "../tenant-pages/tenants-dashboard/tenants-dashboard.component";
import { MaintenanceRequestsComponent } from "../tenant-pages/maintenance-requests/maintenance-requests.component";
import { LandlordDashboardComponent } from "../landlord-pages/landlord-dashboard/landlord-dashboard.component";
import {MaintenanceDashboardComponent} from "../maintenance-pages/maintenance-dashboard/maintenance-dashboard.component";
import { ChatComponent } from "../tenant-pages/chat/chat.component";
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {DialogAddRoom, DialogAddTenant, DialogViewRoom, RoomsComponent} from "../landlord-pages/rooms/rooms.component";
import {DialogAddStaff, MaintenanceComponent} from "../landlord-pages/maintenance/maintenance.component";
import {MaintenanceLogComponent} from "../landlord-pages/maintenance-log/maintenance-log.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    TenantsDashboardComponent,
    MaintenanceRequestsComponent,
    ChatComponent,
    LandlordDashboardComponent,
    MaintenanceDashboardComponent,
    RoomsComponent,
    MaintenanceComponent,
    MaintenanceLogComponent,
    DialogAddRoom,
    DialogViewRoom,
    DialogAddTenant,
    DialogAddStaff,
    DialogNewMessage,
    DialogNeighborMessage
  ]
})

export class LayoutModule {}
