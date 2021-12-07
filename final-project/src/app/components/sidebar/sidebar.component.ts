import { Component, OnInit } from '@angular/core';
// @ts-ignore
import * as $ from "jquery";
import {AuthService} from "../../core/service/auth/auth.service";
import {QueryService} from "../../core/service/query/query.service";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  group: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/tenants', title: 'Dashboard',  icon: 'dashboard', class: '', group: 'tenants' },
  { path: '/landlords', title: 'Dashboard',  icon: 'dashboard', class: '', group: 'landlords' },
  { path: '/rooms', title: 'Rooms',  icon: 'meeting_room', class: '', group: 'landlords' },
  { path: '/maintenance-staff', title: 'Maintenance Staff',  icon:'group', class: '', group: 'landlords' },
  { path: '/maintenance', title: 'Dashboard',  icon: 'dashboard', class: '', group: 'maintenance' },
  { path: '/maintenance-requests', title: 'Maintenance Requests',  icon:'build', class: '', group: 'tenants' },
  { path: '/chatrooms', title: 'Chatrooms', icon:'chat_bubble', class: '', group: 'tenants' },
  { path: '/maintenance-logs', title: 'Maintenance Logs',  icon:'build', class: '', group: 'landlords' },
  { path: '/signout', title: 'Sign Out',  icon:'exit_to_app', group: 'signout', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] | undefined;
  constructor(public queryService: QueryService, public authService: AuthService) { }
  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    // if ($(window).width() > 991) {
    //   return false;
    // }
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };
}
