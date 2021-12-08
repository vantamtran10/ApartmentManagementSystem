import {Component, Inject, OnInit} from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Observable<any[]> | undefined;
  filteredResult: any;
  constructor(public queryService: QueryService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.queryService.LANDLORDGetAllRooms().subscribe(x => {
      this.rooms = x.valueChanges();
      this.filteredResult = [];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== ""){
      this.rooms?.subscribe(x => {
        this.filteredResult = x;
        this.filteredResult = this.filteredResult.filter((t: any) => {
          return (t.room.toString() == filterValue.trim().toLowerCase())
        });
      })
    } else this.filteredResult = [];
  }

  deleteRoom(x: any): void{
    this.queryService.LANDLORDDeleteRoom(x).subscribe();
  }
  openDialog(): void {
    let q = this.rooms?.subscribe(r => {
      let t= this.queryService.LANDLORDUniqueBuildings().subscribe(x => {
        const dialogRef = this.dialog.open(DialogAddRoom, {
          width: '30vw',
          data: {buildings: x, allRooms: r}
        });

        dialogRef.afterOpened().subscribe(r => {
          t.unsubscribe();
          q?.unsubscribe();
        })

        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined){
          }
        });
      });
    })
  }
  openRoomInfoDialog(x: any): void {
    const dialogRef = this.dialog.open(DialogViewRoom, {
      width: '30vw',
      data: {floor: x.floor, room: x.room, building: x.building, tenants: x.tenants}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){

      }
    });
  }
}

@Component({
  selector: 'add-room',
  templateUrl: 'add-room.html',
})
export class DialogAddRoom {
  selectedBuilding: any;
  selectedRoomNumber: any;
  selectedFloor: any;
  success: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddRoom>,
    public queryService: QueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  buildings = this.data.buildings;

  delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  createRoom(){
    for (let i=0; i<this.data.allRooms.length; i++){
      const room = this.data.allRooms[i];
      if (room.building === this.selectedBuilding && room.room === this.selectedRoomNumber && room.floor === this.selectedFloor){
        this.error = "Entry already exists";
        this.success = "";
        return;
      }
    }
    this.queryService.LANDLORDAddRoom(this.selectedBuilding, this.selectedRoomNumber, this.selectedFloor).then(r => {
      this.success = r;
      this.error = "";
      this.delay(1000).then(r => this.dialogRef.close());
    }).catch(e => {
      this.error = e;
      this.success = "";
    });
  }
}

@Component({
  selector: 'view-room',
  templateUrl: 'view-room.html',
})
export class DialogViewRoom {
  tenants: any;
  constructor(
    public dialogRef: MatDialogRef<DialogViewRoom>,
    public queryService: QueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.tenants = [];
    this.data.tenants.forEach((tenant: any) => {
      tenant.get().then((x: any) => {
        this.queryService.LANDLORDSearchUserByID(x.data().id).subscribe(info => this.tenants.push(info));
      });
    })
  }

  removeTenant(tenantRef: any){
    this.queryService.LANDLORDRemoveTenantFromRoom(tenantRef, this.data).then(r => this.updateTenants(r));
  }

  updateTenants(tenants: any){
    this.tenants = [];
    tenants.forEach((tenant: any) => {
      tenant.get().then((x: any) => {
        this.queryService.LANDLORDSearchUserByID(x.data().id).subscribe(info => this.tenants.push(info));
      });
    })
  }

  addTenant(){
    const dialogRef = this.dialog.open(DialogAddTenant, {
      width: '30vw',
      data: {room: this.data.room, floor: this.data.floor, building: this.data.building, tenants: this.tenants}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        this.updateTenants(result);
      }
    });
  }

}

@Component({
  selector: 'add-tenant',
  templateUrl: 'add-tenant.html',
})
export class DialogAddTenant {
  tenantEmail: any;
  success: any;
  error: any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddTenant>,
    public queryService: QueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  validateEmail(mail: any)
  {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

  }
  delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  addTenant(email: any){
    for (let i=0; i<this.data.tenants.length; i++){
      const t = this.data.tenants[i];
      if (t.email === email){
          this.error = 'Tenant already exists in this room';
          this.success = "";
          return;
      }
    }
    this.queryService.LANDLORDAddTenant(email, this.data).then(r => {
      // @ts-ignore
      this.success = r.message;
      this.error = "";
      // @ts-ignore
      this.delay(1000).then(x => this.dialogRef.close(r.tenants));
    }).catch(e => {
      this.error = e;
      this.success = "";
    });
  }
}
