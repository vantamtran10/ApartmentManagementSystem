import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../core/service/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });

  errorMessage: string | undefined;
  successMessage: string | undefined;
  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  tryLogin(value: any){
    this.authService.doLogin(value)
      .then(res => {
        this.errorMessage = "";
        this.successMessage = "Successful Login";
      }, err => {
        this.errorMessage = "Invalid username/password entered";
        this.successMessage = "";
      })
  }
  tryLogout(){
    this.authService.logOut()
      .then(res => {
        this.router.navigate(['login']).then(r => {
          this.errorMessage = "";
          this.successMessage = "Successful Logout";
        });
      })
  }
  testPage(){
    if (this.authService.isLoggedIn){
      this.router.navigate(['test']);
    }
  }
}
