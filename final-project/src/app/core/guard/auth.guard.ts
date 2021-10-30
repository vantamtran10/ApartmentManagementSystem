import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../service/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.authService.isLoggedIn) {
      this.router.navigate(['login'])
    } else {
      // @ts-ignore
      let userGroup = JSON.parse(localStorage.getItem('user')).type.group;
      let path = next.routeConfig?.path;
      if (userGroup != path){
        if (userGroup == "tenants"){
          this.router.navigate(['tenants']);
        } else if (userGroup == "landlords"){
          this.router.navigate(['landlords']);
        } else if (userGroup == "maintenance"){
          this.router.navigate(['maintenance']);
        }
      }
      return userGroup == path;
    }
    return false;
  }

}
