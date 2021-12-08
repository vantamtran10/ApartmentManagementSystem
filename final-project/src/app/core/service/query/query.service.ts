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

  LANDLORDAddRoom(building: number, room_num: number, floor: number){
    return new Promise((resolve, reject) => {
      this.firestore.collection('rooms').add({
        building: building,
        floor: floor,
        room: room_num,
        tenants: []
      }).then(r => resolve('Room was added'))
        .catch(e => reject('There was an error'))
    });
  }

  LANDLORDAddTenant(tenantEmail: any, roomData: any){
    return new Promise((resolve, reject) => {
      this.firestore.collection('users', ref => ref.where('email', '==', tenantEmail)).get().subscribe(userSearch => {
        if (userSearch.docs.length === 0) reject('User not found');
        else{
          // @ts-ignore
          this.firestore.collection('tenants', ref => ref.where('id', '==', userSearch.docs[0].data().id)).get().subscribe(tenantSearch => {
            if (tenantSearch.docs.length === 0) reject('User is not a Tenant');
            else {
              this.firestore.collection('rooms', ref => ref.where('room', '==', roomData.room)).get().subscribe(roomSearch => {
                if (roomSearch.docs.length === 1){
                  // @ts-ignore
                  let t = roomSearch.docs[0].data().tenants;
                  t.push(tenantSearch.docs[0].ref);
                  // @ts-ignore
                  roomSearch.docs[0].ref.update('tenants', t).then(r => resolve({message: 'Tenant was added', tenants: t}))
                    .catch(e => reject('There was an error'));
                } else {
                  roomSearch.docs.forEach(x => {
                    // @ts-ignore
                    if (x.data().building === roomData.building && x.data().floor === roomData.floor){
                      // @ts-ignore
                      let t = x.data().tenants;
                      t.push(tenantSearch.docs[0].ref);
                      // @ts-ignore
                      x.ref.update('tenants', t).then(r => resolve({message: 'Tenant was added', tenants: t}))
                        .catch(e => reject('There was an error'));
                    }
                  })
                }
              })
            }
          })
        }
      })
    });
  }

  LANDLORDDeleteRoom(deletion: any){
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('rooms', ref => ref.where('room', '==', deletion.room)).get().subscribe(roomSearch => {
        if (roomSearch.docs.length === 1){
          roomSearch.docs[0].ref.delete();
        } else {
          roomSearch.docs.forEach(x => {
            // @ts-ignore
            if (x.data().building === deletion.building && x.data().floor === deletion.floor){
              x.ref.delete();
            }
          })
        }
      })
    });
  }

  LANDLORDGetCompletedMaintenanceRequestsForWeek(Sunday: object) {
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('maintenance-requests', ref => ref.where('created', '>=', Sunday)).get().subscribe(data => {
        observer.next(data);
      });
    });
  }

  LANDLORDGetAllRooms(){
    return new Observable((observer: Observer<any>) => {
      observer.next(this.firestore.collection('rooms', ref => ref.orderBy('room')));
    });
  }

  LANDLORDUniqueBuildings(){
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('rooms').get().subscribe(x => {
        let a: unknown[] = [];
        x.docs.forEach(element => {
          a.push(element.data());
        })
        observer.next([...new Set(a.map((item: any) => item.building))]);
      })
    });
  }

  LANDLORDGetAllMaintenanceStaff(){
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('users').get().subscribe(staff => {
        let maintenance: unknown[] = [];
        staff.docs.forEach(x => {
          // @ts-ignore
          if (x.data().type.parent.id === 'maintenance') maintenance.push(x.data());
        })
        observer.next(maintenance);
      });
    });
  }

  LANDLORDRemoveTenantFromRoom(tenantRef: any, roomInfo: any){
    return new Promise((resolve, reject) => {
      this.firestore.collection('rooms', ref => ref.where('room', '==', roomInfo.room)).get().subscribe(roomSearch => {
        if (roomSearch.docs.length === 1){
          // @ts-ignore
          let t = roomSearch.docs[0].data().tenants;
          t = t.filter((item: any) => item.id !== tenantRef.id);
          // @ts-ignore
          roomSearch.docs[0].ref.update('tenants', t).then(r => resolve(t))
            .catch(e => reject('There was an error'));
        } else {
          roomSearch.docs.forEach(x => {
            // @ts-ignore
            if (x.data().building === roomInfo.building && x.data().floor === roomInfo.floor){
              // @ts-ignore
              let t = x.data().tenants;
              t = t.filter((item: any) => item.id !== tenantRef.id);
              // @ts-ignore
              x.ref.update('tenants', t).then(r => resolve(t))
                .catch(e => reject('There was an error'));
            }
          })
        }
      })
    });
  }

  LANDLORDSearchUserByID(id: any){
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('users', ref => ref.where('id', '==', id)).get().subscribe(x => {
        if (x.docs.length === 1){
          observer.next(x.docs[0].data());
        }
      });
    });
  }

  LANDLORDGetAllMaintenanceLog(){
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('maintenance-requests', ref => ref.orderBy('created', 'desc')).get().subscribe(logs => {
        let d: unknown[] = [];
        logs.docs.forEach(x => {
          d.push(x.data());
        })
        observer.next(d);
      });
    });
  }

  TENANTGetNeighbors() {
    return new Observable((observer: Observer<any>) => {
      let floor = this.userData.type.floor;
      this.firestore.collection('rooms', ref => ref.where('floor', '==', floor)).get()
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
      this.firestore.collection('rooms', ref => ref.where('room', '==', this.userData.type.room)).get().subscribe(roomRef => {
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

  TENANTGetMaintenanceRequests(): Observable<any[]>{
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('tenants', ref => ref.where('id', '==', this.userData.id)).get()
        // @ts-ignore
        .subscribe(tenant => {
          if (tenant.docs.length === 1){
            observer.next(this.firestore.collection('maintenance-requests', ref2 => ref2.where('tenant', '==', tenant.docs[0].ref)));
          }
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

  USERChatMessage(){
    return new Observable((observer: Observer<any>) => {
      // @ts-ignore
      this.firestore.collection('chat').get().subscribe(x => {
        if (x.docs.length === 1){
          // @ts-ignore
          observer.next(x.docs[0].ref);
        }
      });
    });
  }

  USERSendChatMessage(message: string){
    this.firestore.collection('chat').get().subscribe(x => {
      if (x.docs.length === 1){
        // @ts-ignore
        let m = x.docs[0].data()['messages'];
        let name = `${this.userData.first_name} ${this.userData.last_name}`
        m.push({'name': name, 'message': message, 'photo': this.userData.photo, 'time': new Date()})
        x.docs[0].ref.update({'messages': m})
      }
    })
  }

  // Tam Tran add
  COUNTMaintenanceRequests(){
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('maintenance-requests').get().subscribe(x => {
          observer.next(x);
      });
    });
  }

  COUNTMaintenanceUsers(){
    return new Observable((observer: Observer<any>) => {
      // @ts-ignore
      this.firestore.collection('maintenance').get().subscribe(x => {
        observer.next(x);
      });
    });
  }

  getInfoUsers(): Observable<any[]> {
    return new Observable((observer: Observer<any>) => {
      this.firestore.collection('maintenance').get().subscribe(x => {

        for (let i=0; i< x.docs.length; i++){
          // @ts-ignore
          this.firestore.collection('users', ref => ref.where('id', '==', `${x.docs[i].data().id}`)).get().subscribe( data => {
            let result = data.docs[0].data();
            observer.next(result);
          });
        }
        });
    });
  }
}
