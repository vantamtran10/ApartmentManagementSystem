import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore";
import {Router} from "@angular/router";
import { User } from "../user/user"
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, public router: Router){
    // Saving user data in localstorage when logged in and setting up null when logged out
    this.afAuth.authState.subscribe(async user => {
      let userData;
      if (user) {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, where("id", "==", user.uid));
        const userQuerySnapshot = await getDocs(usersQuery);
        if (userQuerySnapshot.docs.length == 1){
          const userDoc = userQuerySnapshot.docs[0].data();
          const group = userDoc.type.parent.id;
          const typeRef = collection(db, group);
          const typeQuery = query(typeRef, where("id", "==", user.uid));
          const typeQuerySnapshot = await getDocs(typeQuery);
          if (typeQuerySnapshot.docs.length == 1){
            const typeDoc = typeQuerySnapshot.docs[0].data();
            userData = userDoc;
            userData['type'] = typeDoc;
            userData['type']['group'] = group;
            localStorage.setItem('user', JSON.stringify(userData));
            JSON.parse(<string>localStorage.getItem('user'));
            this.router.navigate([group]);
          }
        }
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
        location.reload();
        // this.router.navigate(['login']);
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
