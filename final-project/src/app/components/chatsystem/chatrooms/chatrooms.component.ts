import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { DatePipe } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

export const snapshotToArray = (snapshot: any) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: 'app-chatrooms',
  templateUrl: './chatrooms.component.html',
  styleUrls: ['./chatrooms.component.scss']
})

export class ChatroomsComponent implements OnInit {

  public nickname: (string | null) = '';
  public displayedColumns = ['roomname'];
  public rooms: (Observable<any[]>);
  public roomList = []
  public isLoadingResults = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    private db: AngularFireDatabase
  ) {
    this.rooms = db.list('rooms').valueChanges();
    this.isLoadingResults = false;

  }

  // work-in-progress
  enterChatRoom(roomname: string) {
    const chat:any = {roomname: '', nickname: '', message: '', date: '', type: ''};
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = '${this.nickname} enter the room';
    chat.type = 'join';
    const newMessage = firebase.database().ref('chat/').push();
    newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if(user !== undefined) {
        const userRef = firebase.database().ref('roomusers/' + user.key);
        userRef.update({status: 'online'});
      } else {
        const newroomuser:any = { roomname: '', nickname: '', status: ''};
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        const newRoomUser = firebase.database().ref('roomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });

    this.router.navigate(['/chatroom', roomname]);
  }

  logout(): void {
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {



  }

}
