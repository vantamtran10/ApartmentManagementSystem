import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./core/guard/auth.guard";

import { LoginComponent } from "./components/login/login.component";
import { TestComponent } from "./components/test/test.component";
import {LayoutComponent} from "./components/layout/layout.component";
import {MaintenanceComponent} from "./components/maintenance/maintenance.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./../app/components/layout/layout.module').then(m => m.LayoutModule)
    }]
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
