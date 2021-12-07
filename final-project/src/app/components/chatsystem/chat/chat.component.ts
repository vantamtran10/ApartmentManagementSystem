import firebase from 'firebase/compat/app';

import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { QueryService } from 'src/app/core/service/query/query.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatForm!: FormGroup;
  nickname: string|null = '';
  roomname = '';
  message = '';
  chats: any[] = [];
  matcher = new MyErrorStateMatcher();
  scrolltop!: number;
  dbref: any;

  @ViewChild('chatcontent')
  chatcontent!: ElementRef;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private queryService: QueryService) {
                this.nickname = <string> this.queryService.userData.first_name + " " + this.queryService.userData.last_name;
                var url = router.url;
                this.roomname = url.slice(10,url.length);
                this.dbref = firebase.database().ref('chats/');
                firebase.database().ref('chats/').on('value', resp => {
                  this.chats = this.snapshotToArray(resp);
                  setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
                });

                // filter chat for room
                this.chats = this.chats.filter(function(item) {
                  return item.roomname == router.url.slice(10, router.url.length);
                }
                );
  }

  snapshotToArray(snapshot: any) {
    const returnArr: any[] = [];

    snapshot.forEach((childSnapshot: any) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        if(item.roomname == this.roomname)
          returnArr.push(item);
    });

    return returnArr;
  };

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });

  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.type = 'message';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  exitChat() {
    this.router.navigate(['/roomlist']);
  }
}
