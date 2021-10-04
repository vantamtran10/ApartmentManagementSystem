import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { AuthService } from "../../core/service/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });
  errorMessage: string | undefined;
  successMessage: string | undefined;
  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  tryLogin(value: any){
    this.authService.doLogin(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Successful Login";
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }
  tryLogout(){
    this.authService.logOut()
      .then(res => {
        this.router.navigate(['login']).then(r => {
          console.log(res);
          this.errorMessage = "";
          this.successMessage = "Successful Logout";
        });
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }
  testPage(){
    if (this.authService.isLoggedIn){
      this.router.navigate(['test']);
    }
  }
}
