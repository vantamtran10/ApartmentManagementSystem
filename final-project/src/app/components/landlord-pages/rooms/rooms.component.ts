import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: any;
  constructor(public queryService: QueryService) { }

  ngOnInit(): void {
    this.queryService.LANDLORDGetAllRooms().subscribe(x => {
      this.rooms = [];
      x.docs.forEach((room: any) => {
        this.rooms.push(room.data());
      })
    });
  }

}
