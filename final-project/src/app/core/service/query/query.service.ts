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

  USERGetMessages(){
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('messages', ref => ref.where('id', '==', `${this.userData.id}`)).get().subscribe(messages => {
        if (messages.docs.length === 1){
          let incoming: any[] = [];
          // @ts-ignore
          for (let i=0; i<messages.docs[0].data().incoming.length; i++){
            // @ts-ignore
            let temp = messages.docs[0].data().incoming[i];
            const date = new Date(temp.time.seconds*1000);
            temp['time'] = `${date.getMonth()+1}/${date.getDay()}/${date.getFullYear()} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true})}`
            // @ts-ignore
            messages.docs[0].data().incoming[i].from.get().then((x: any) => {
              temp['from'] = `${x.data().first_name} ${x.data().last_name}`;
              temp['fromID'] = x.data().id;
              temp['messageID'] = i;
              incoming.push(temp);
            });
          }
          observer.next(incoming);
        }
      });
    });
  }

  USERDeleteMessage(index: number){
    return new Promise((resolve, reject) => {
      this.firestore.collection('messages', ref => ref.where('id', '==', `${this.userData.id}`)).get().subscribe(messages => {
        if (messages.docs.length === 1){
          // @ts-ignore
          let incoming = messages.docs[0].data().incoming;
          incoming.splice(index, 1);
          messages.docs[0].ref.update({'incoming': incoming}).then(r => resolve(r));
        } else {
          reject();
        }
      });
    });
  }

  USERSendMessage(TOid: string, message: string, subject: string){
    return new Promise((resolve, reject) => {
      this.firestore.collection('users', ref => ref.where('id', '==', `${this.userData.id}`)).get().subscribe(user => {
        if (user.docs.length === 1){
          let fromRef = user.docs[0].ref;
          this.firestore.collection('messages', ref2 => ref2.where('id', '==', `${TOid}`)).get().subscribe(messages => {
            if (messages.docs.length === 1){
              let m = {
                from: fromRef,
                message: message,
                subject: subject,
                time: new Date()
              }
              // @ts-ignore
              let incoming = messages.docs[0].data().incoming;
              incoming.push(m);
              messages.docs[0].ref.update({'incoming': incoming}).then(r => resolve(r));
            }
          });
        }
      });
    });
  }
}
