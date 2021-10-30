import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(public afAuth: AngularFireAuth, public router: Router){
    // Saving user data in localstorage when logged in and setting up null when logged out
    this.afAuth.authState.subscribe(async user => {
      if (user) {
        const db = getFirestore();
        let docRef = doc(db, "users", user.uid);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let data = docSnap.data();
          const group = data.type.parent.id;
          docRef = doc(db, data.type.parent.id, data.type.id)
          docSnap = await getDoc(docRef);
          if (docSnap.exists()){
            this.userData = data;
            this.userData["id"] = user.uid;
            this.userData["type"] = docSnap.data();
            this.userData["type"]["group"] = group;
            console.log(this.userData); //
            localStorage.setItem('user', JSON.stringify(this.userData));
            JSON.parse(<string>localStorage.getItem('user'));
            this.router.navigate([group]);
          } else {
            console.log("That person has not been registered into a user group!")
          }
        } else {
          console.log("That person does not exist!");
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
