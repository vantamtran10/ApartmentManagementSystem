import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./core/guard/auth.guard";

import { LoginComponent } from "./components/login/login.component";
import { TestComponent } from "./components/test/test.component";
import {LayoutComponent} from "./components/layout/layout.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  // { path: 'tenants', component: TenantComponent, canActivate: [AuthGuard]},
  { path: 'landlords', component: TestComponent, canActivate: [AuthGuard]},
  {
    path: '',
    component: LayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./../app/components/layout/layout.module').then(m => m.LayoutModule)
    }]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
