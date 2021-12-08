import { QueryService } from './../../../core/service/query/query.service';
import { AddroomComponent } from './../addroom/addroom.component';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Routes } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ChatComponent } from '../chat/chat.component';

const routes: Routes = [
  { path: '/addroom', component: AddroomComponent },
  { path: 'chat', component: ChatComponent},
];

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
    private queryService: QueryService,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase
  ) {
    this.rooms = db.list('rooms').valueChanges();
    this.isLoadingResults = false;
  }

  enterChatRoom(roomname: string) {
    this.router.navigate(['/chatroom', roomname]);
  }



  ngOnInit(): void {

  }

}
