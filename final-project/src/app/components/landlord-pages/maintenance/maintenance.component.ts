import {Component, Inject, OnInit} from '@angular/core';
import {QueryService} from "../../../core/service/query/query.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  staff: any
  staffFiltered: any;
  constructor(public queryService: QueryService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.queryService.LANDLORDGetAllMaintenanceStaff().subscribe(x => {
      x.snapshotChanges().subscribe((r: any) => {
        this.staff = [];
        r.forEach((element: any) => {
          this.queryService.LANDLORDSearchUserByID(element.payload.doc.data().id).subscribe(user => {
            this.staff.push(user);
          })
        })
      })
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== "") {
      this.staffFiltered = this.staff.filter((t: any) => {
        return (t.first_name.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                t.last_name.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                t.status.toLowerCase().includes(filterValue.trim().toLowerCase()))
      });
    }
  }
  removeStaff(id: string){
    this.queryService.LANDLORDRemoveMaintenanceStaff(id);
  }
  openStaffAddDialog(){
    const dialogRef = this.dialog.open(DialogAddStaff, {
      width: '30vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){

      }
    });
  }
}

@Component({
  selector: 'add-staff',
  templateUrl: 'add-staff.html',
})
export class DialogAddStaff {
  success: any;
  error: any;
  staffEmail: any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddStaff>,
    public queryService: QueryService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  validateEmail(mail: any)
  {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

  }

  delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  addStaff(email: string){
    this.queryService.LANDLORDAddMaintenanceStaff(email).then(r => {
      this.success = r;
      this.error = "";
      this.delay(1000).then(r => this.dialogRef.close());
    }).catch(e => {
      this.error = e;
      this.success = "";
    })
  }
}
