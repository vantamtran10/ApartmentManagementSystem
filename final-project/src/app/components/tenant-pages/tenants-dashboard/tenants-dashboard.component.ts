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
      console.log(this.messages);
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
      width: '250px',
      data: {from: from, subject: subject, message: message, time: time, fromID: fromID, messageID: messageID}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) this.messages.splice(result, 1);
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
      width: '250px',
      // data: {from: from, subject: subject, message: message, time: time, fromID: fromID, messageID: messageID}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.messages.splice(result, 1);
    // });
  }

}

@Component({
  selector: 'reply-message',
  templateUrl: 'reply-message.html',
})
export class DialogReplyMessage {

  constructor(
    public dialogRef: MatDialogRef<DialogReplyMessage>,
    public queryService: QueryService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  deleteMessage(){
    this.queryService.USERDeleteMessage(this.data.messageID).then(x => {
      this.dialogRef.close(this.data.messageID);
    });
  }

}
