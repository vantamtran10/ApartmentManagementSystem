import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() {
    firebase.initializeApp(environment);
  }

  ngOnInit(): void {

  }

}
