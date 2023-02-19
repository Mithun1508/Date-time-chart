import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subject, interval, of } from 'rxjs';
import { map, scan, share, filter } from 'rxjs/operators';

@Component({
  selector: 'c8y-data',
  template: '<ng-container></ng-container>'
})
export class C8yDataDirective {
  @Input() selectedRange: [ Date, Date ];
  @Input() realtime: boolean = false;
  @Output() onData = new EventEmitter<Array<[Date, number]>>();
  @Output() onRange = new EventEmitter<[ Date, Date ]>();
  rate = 1000/60;
  dateFrom;
  dateTo;
  timeoutCleanData;
  timeoutRange;
  timeoutData;
  data: any[] = [];
  ngOnChanges(changes) {
    if (changes.selectedRange || changes.realtime) {
      const [ dateFrom , dateTo ] = this.selectedRange;
      this.generateData(dateFrom, dateTo);
      this.updateRange();
      this.cleanData();
    }
  }

  generateData(from, to) {
    const date = new Date(from.getTime());
    const dateTo = to.getTime();
    const list = [];
    const update = () => {
      if (!this.realtime) return;
      const { length } = this.data;
      const now = (new Date()).getTime();
      const val = Math.cos((length + 1) * 0.2) * 100 + Math.random() * 30;
      this.data.push([ now, val ]);
      this.onData.next(Array.from(this.data));
      clearTimeout(this.timeoutData);
      if (this.realtime) this.timeoutData = setTimeout(update, 1000);
    };
    let count = 0;
    while (date.getTime() <= dateTo) {
      date.setSeconds(date.getSeconds() + 1);
      list.push([
        date.getTime(),
        Math.cos((count++) * 0.2) * 100 + Math.random() * 30
      ]);
    }
    this.data = list;
    this.onData.next(this.data);
    update();
  }

  cleanData() {
    if (!this.realtime) return;
    const dateFrom = this.dateFrom.getTime();
    const dateTo = this.dateTo.getTime();
    const index = this.data.findIndex(([ time ]) => time >= dateFrom);
    if (index > 0) this.data = this.data.slice(index - 1);
    clearTimeout(this.timeoutCleanData);
    if (this.realtime) {
      this.timeoutCleanData = setTimeout(() => this.cleanData(), 2000);
    }
  }

  updateRange() {
    let [ dateFrom, dateTo ] = this.selectedRange;
    const diff = dateTo.getTime() - dateFrom.getTime();
    if (this.realtime) {
      dateTo = new Date();
      dateFrom = (new Date(dateTo.getTime()))
      dateFrom.setMilliseconds(dateFrom.getMilliseconds() - diff);
      clearTimeout(this.timeoutRange);
      this.timeoutRange = setTimeout(() => this.updateRange(), 1000/25);
    }
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.onRange.next([ dateFrom, dateTo ]);
  }

  getDataObservable() {
    return interval(100).pipe(
      filter(() => Math.random() > 0.5),
      map(() => [new Date(), Math.random() * 100]),
      scan((acc, val) => {
        acc.push(val)
        return acc;
      }, []),
      share()
    );
  }

}