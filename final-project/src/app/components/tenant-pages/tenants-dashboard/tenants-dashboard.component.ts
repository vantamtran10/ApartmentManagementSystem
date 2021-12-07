import {Component, Inject, OnInit} from '@angular/core';
import { QueryService } from "../../../core/service/query/query.service";
import {FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-tenants-dashboard',
  templateUrl: './tenants-dashboard.component.html',
  styleUrls: ['./tenants-dashboard.component.scss']
})
export class TenantsDashboardComponent implements OnInit {
  neighbors: any;
  messages: any;
  Object = Object;
  subject = new FormControl('');
  description = new FormControl('');
  errorMessage: string | undefined;
  successMessage: string | undefined;
  constructor(public queryService: QueryService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.neighbors = {};
    this.queryService.TENANTGetNeighbors().subscribe(data => {
      this.neighbors[data.id] = data;
    });
    this.queryService.USERGetMessages().subscribe(x => {
      this.messages = x;
    });
  }

  createMaintenanceRequest(): void{
    this.queryService.TENANTCreateMaintenanceRequest(this.subject.value, this.description.value).then(r => {
      this.errorMessage = '';
      // @ts-ignore
      this.successMessage = r;
    }).catch(e => {
      this.successMessage = '';
      this.errorMessage = e;
    });
  }

  openDialog(from: string, subject: string, message: string, time: string, fromID: string, messageID: number): void {
    const dialogRef = this.dialog.open(DialogReadMessage, {
      width: '30vw',
      data: {from: from, subject: subject, message: message, time: time, fromID: fromID, messageID: messageID}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        this.queryService.USERGetMessages().subscribe(x => {
          this.messages = x;
        });
      }
    });
  }

  openNeighborDialog(first_name: string, last_name: string, room: number, photo: string){
    const dialogRef = this.dialog.open(DialogNeighbor, {
      width: '15vw',
      data: {first_name: first_name, last_name: last_name, room: room, photo: photo}
    });
  }


}

@Component({
  selector: 'read-message',
  templateUrl: 'read-message.html',
})
export class DialogReadMessage {

  constructor(
    public dialogRef: MatDialogRef<DialogReadMessage>,
    public queryService: QueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  deleteMessage(){
    this.queryService.USERDeleteMessage(this.data.messageID).then(x => {
      this.dialogRef.close(this.data.messageID);
    });
  }

  openDialogReply(): void {
    const dialogRef = this.dialog.open(DialogReplyMessage, {
      width: '30vw',
      data: this.data
    });

    // dialogRef.afterClosed().subscribe(result => {
    //
    // });
  }

}

@Component({
  selector: 'reply-message',
  templateUrl: 'reply-message.html',
})
export class DialogReplyMessage {
  message = new FormControl('');
  messageDelivered = '';
  constructor(
    public dialogRef: MatDialogRef<DialogReplyMessage>,
    public queryService: QueryService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  sendMessage(){
    // @ts-ignore
    let message = document.getElementById("message").value
    this.queryService.USERSendMessage(this.data.fromID, `${message}\n------------\n${this.data.time} ${this.data.from}: ${this.data.message}`, `RE: ${this.data.subject}`).then(r => {
      this.messageDelivered = 'Message sent successfully';
      this.delay(3000).then(r => this.dialogRef.close());
    });
  }

}

@Component({
  selector: 'neighbor',
  templateUrl: 'neighbor.html',
})
export class DialogNeighbor {
  constructor(
    public dialogRef: MatDialogRef<DialogReplyMessage>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
