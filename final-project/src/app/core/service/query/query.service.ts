import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable, Observer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  userData: any;
  constructor(public authService: AuthService, public firestore: AngularFirestore) {
    this.userData = JSON.parse(<string>localStorage.getItem('user'));
  }

  TENANTGetNeighbors() {
    return new Observable((observer: Observer<any>) => {
      let building = this.userData.type.building;
      let floor = this.userData.type.floor;
      this.firestore.collection(`building${building}`, ref => ref.where('floor', '==', floor)).get()
        .subscribe(data => {
          for (const i of data.docs){
            // @ts-ignore
            for (const j of i.data().tenants){
              j.get().then((x: any) => {
                if (x.data().id !== this.userData.id){
                  this.firestore.collection('users', ref2 => ref2.where('id', '==', x.data().id)).get()
                    // @ts-ignore
                    .subscribe(data => {
                      let rVal = data.docs[0].data();
                      // @ts-ignore
                      rVal['room'] = x.data().room;
                      observer.next(rVal);
                    });
                }
              });
            }
          }
        });
    });
  }

  TENANTCreateMaintenanceRequest(subject: string, description: string){
    return new Promise((resolve, reject) => {
      this.firestore.collection(`building${this.userData.type.building}`, ref => ref.where('room', '==', this.userData.type.room)).get().subscribe(roomRef => {
        if (roomRef.docs.length == 1){
          this.firestore.collection(`tenants`, ref => ref.where('id', '==', this.userData.id)).get().subscribe(tenantRef => {
            if (tenantRef.docs.length == 1){
              this.firestore.collection('maintenance-requests').add({
                created: new Date(),
                room: roomRef.docs[0].ref,
                tenant: tenantRef.docs[0].ref,
                details: {
                  subject: subject,
                  description: description,
                  status: 'open'
                }
              }).then(mRequestRef => {
                // @ts-ignore
                let a = tenantRef.docs[0].data().maintenance_requests;
                a.push(mRequestRef);
                tenantRef.docs[0].ref.update({'maintenance_requests': a});
                resolve('Maintenance Request has been added!')
              }).catch(e => reject('There was an error!'))
            } else reject('There was an error')
          });
        } else reject('There was an error!')
      });
  });
  }
}
