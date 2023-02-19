import { Component } from '@angular/core';
import { extent } from 'd3';
import { of } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  dataList: any[];
  timeRange: [Date, Date];
  timeRangeA: [Date, Date];
  totalPoints = 1000;

  ngOnInit() {
    this.createList();
  }

  createList() {
    const t = Math.round(Math.random() * 10) + 10;
    const dataList = this.dataList = [];
    for (let i  = 0; i < 20; i++) {
      dataList.push({
        data: of(this.createData()),
        dataPoint: {
          color: this.color()
        }
      });
    }
    this.timeRange = extent(this.createData(), ([time]) => time);
    const [from, to] = this.timeRange;
    from.setDate(from.getDate() + Math.round(Math.random() * this.totalPoints) - (this.totalPoints / 2))
    to.setDate(to.getDate() + Math.round(Math.random() * this.totalPoints) - (this.totalPoints / 2))
  }

  color() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createData() {
    const data = [];
    for (let  i = 0, t = this.totalPoints; i < t; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      data.push([
        date,
        Math.random() * 100
      ]);
    }
    return data;
  }
}
