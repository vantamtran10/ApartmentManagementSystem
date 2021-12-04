import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private msgerForm: any | null;
  private msgerInput: any | null;
  private msgerChat: any | null;
  public msgs: any;
  constructor(public queryService: QueryService) {
    // @ts-ignore
    this.queryService.USERChatMessage().subscribe(x => {
      x.onSnapshot((x: any) => {
        this.msgs = x.data().messages;
      })
    });
  }

  ngOnInit(): void {
    this.msgerForm = this.get(".msger-inputarea");
    this.msgerInput = this.get(".msger-input");
    this.msgerChat = this.get(".msger-chat");
  }
  sendMessage(event: any){
    // @ts-ignore
    event.preventDefault();
    this.queryService.USERSendChatMessage(this.msgerInput.value);
    this.msgerInput.value = "";
  }

  get(selector: any, root = document) {
    return root.querySelector(selector);
  }

}
