import { Component, OnInit } from '@angular/core';
// @ts-ignore
import * as $ from "jquery";
import {AuthService} from "../../core/service/auth/auth.service";

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
  { path: '/uqfgqqefe', title: 'Maintenance Requests',  icon:'build', class: '', group: 'tenants' },
  { path: '/afasfsaf', title: 'Chat',  icon:'chat_bubble', class: '', group: 'tenants' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] | undefined;
  constructor(public authService: AuthService) { }
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
