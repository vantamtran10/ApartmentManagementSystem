import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';

const config = {
  apiKey: "AIzaSyDAHvtPAq2GLFA-RcLw1PlKfthL08Om3jQ",
  authDomain: "finalproject-d2f5c.firebaseapp.com",
  databaseURL: "https://finalproject-d2f5c-default-rtdb.firebaseio.com",
  projectId: "finalproject-d2f5c",
  storageBucket: "finalproject-d2f5c.appspot.com",
  messagingSenderId: "61219560261",
  appId: "1:61219560261:web:ba0862cb12fa9b17aafc2c"
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() {
    firebase.initializeApp(config);
  }

  ngOnInit(): void {

  }

}
