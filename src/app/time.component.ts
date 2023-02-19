import { Component, Output, Input, EventEmitter } from '@angular/core';


@Component({
  selector: 'c8y-time-range',
  template: `<input type="range" min="1" max="500" value="1" (change)="change($event.target.value)">`
})
export class TimeRange {
  @Input() realtime: Boolean = false;
  @Output() range = new EventEmitter();

  ngOnInit() {
    this.change(1);
  }

  change(value) {
    const from = new Date();
    const to = new Date();
    from.setMinutes(from.getMinutes() - value);
    this.range.emit([from, to]);
  }
}