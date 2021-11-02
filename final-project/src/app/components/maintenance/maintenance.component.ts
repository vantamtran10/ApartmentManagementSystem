import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  list: Observable<any[]>;
  constructor(firestore: AngularFirestore) {
    this.list = firestore.collection('maintenance-requests').valueChanges();

  }

  ngOnInit(): void {

  }

}
