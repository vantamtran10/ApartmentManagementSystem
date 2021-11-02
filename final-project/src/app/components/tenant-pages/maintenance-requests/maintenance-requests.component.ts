import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss']
})
export class MaintenanceRequestsComponent implements OnInit {

  list: Observable<any[]>;
  constructor(firestore: AngularFirestore) {
    this.list = firestore.collection('maintenance-requests').valueChanges();
  }

  ngOnInit(): void {
  }

}
