import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import {QueryService} from "../../../core/service/query/query.service";
// @ts-ignore
import moment = require("moment");

@Component({
  selector: 'app-landlord-dashboard',
  templateUrl: './landlord-dashboard.component.html',
  styleUrls: ['./landlord-dashboard.component.scss']
})
export class LandlordDashboardComponent implements OnInit {

  constructor(public queryService: QueryService) { }

  ngOnInit(): void {
    const Sunday = moment().startOf('week');
    this.queryService.LANDLORDGetCompletedMaintenanceRequestsForWeek(Sunday.toDate()).subscribe(next => {
      const docs = next.docs;
      let peak = 0;
      let values = [0, 0, 0, 0, 0, 0, 0]
      docs.forEach((x: any) => {
        if (x.data().details.status === 'done'){
          const valuesIndex = new Date(x.data().created.seconds * 1000).getDay();
          values[valuesIndex]++;
          if (values[valuesIndex] > peak) peak = values[valuesIndex];
        }
      });
      const dataCompletedTasksChart: any = {
        labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
        series: [
          values
        ]
      };
      const optionsCompletedTasksChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0,
        }),
        axisY: {
          onlyInteger: true,
        },
        low: 0,
        high: peak + peak,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }
      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);
    });
  }

}
