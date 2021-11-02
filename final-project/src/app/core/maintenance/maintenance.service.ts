import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase, AngularFireAction } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  maintenanceList: { };
  constructor(firestore: AngularFirestore) {
    this.maintenanceList = firestore.collection('maintenance-requests').valueChanges();
  }
}
