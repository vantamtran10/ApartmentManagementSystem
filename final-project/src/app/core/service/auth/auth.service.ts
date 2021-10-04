import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(public afAuth: AngularFireAuth){
    // Saving user data in localstorage when logged in and setting up null when logged out
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(<string>localStorage.getItem('user'));
      } else {
        // @ts-ignore
        localStorage.setItem('user', null);
        JSON.parse(<string>localStorage.getItem('user'));
      }
    })
  }

  doLogin(value: { email: string; password: string; }){
    return new Promise<any>((resolve, reject) => {
      const auth = getAuth();
      signInWithEmailAndPassword (auth, value.email, value.password)
        .then((userCredential) => {
          // const user = userCredential.user;
          resolve(userCredential);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  logOut() {
    return new Promise<any>((resolve, reject) => {
      return this.afAuth.signOut()
        .then((res) => {
        localStorage.removeItem('user');
        resolve(res);
      })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // Returns true when user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    return (user !== null);
  }
}
