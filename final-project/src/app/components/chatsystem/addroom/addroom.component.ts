import { environment } from './../../../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { getDatabase, push, ref } from "firebase/database";
import { Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.scss']
})

export class AddroomComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private router: Router) { }

  ngOnInit(): void {
    const app = initializeApp(environment.firebase);
    const database = getDatabase(app);
  }

  addRoom(f: NgForm) {
    const db = getDatabase();

    push(ref(db, 'rooms'), {
        roomname: f.value.roomName
    });

    this.router.navigate(['chatrooms'])

  }

}
