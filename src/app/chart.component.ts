import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostBinding,
  Input,
  HostListener
} from "@angular/core";
import {
  scaleLinear,
  scaleTime,
  line,
  curveStep,
  curveSmooth,
  extent
} from "d3";
import { throttleTime } from "rxjs/operators";

@Component({
  selector: "c8y-chart",
  template: "<canvas #canvas></canvas>"
})
export class C8yChartComponent implements OnInit {
  subscription: any;
  @ViewChild("canvas") canvas;
  @Input() data: Array<[Date, number]>;
  @Input() timeRange: Array<[Date, Date]>;
  @Input() dataPoint: any;

  constructor(private element: ElementRef) {}

  get context() {
    return this.canvas.nativeElement.getContext("2d");
  }

  get color() {
    return (this.dataPoint && this.dataPoint.color) || "red";
  }

  get width() {
    return this.element.nativeElement.offsetWidth;
  }

  get height() {
    return this.element.nativeElement.offsetHeight;
  }

  get translate() {
    return Math.round(this.width - this.x()(new Date()));
  }

  ngOnInit() {}

  ngOnChanges(changes) {
    if (this.data && this.timeRange && this.dataPoint) {
      this.render();
    }
  }

  ngAfterViewInit() {
    this.resizeCanvas();
    this.ngOnChanges({});
  }

  observe(o) {
    return o.subscribe(data => {
      this.data = data;
      window.requestAnimationFrame(() => this.render());
    });
  }

  moveRealtime() {
    const { context } = this;
    const render = () => {
      this.canvas.nativeElement.style.transform = `translateX(${
        this.translate
      }px) translateZ(0)`;
      window.requestAnimationFrame(render);
    };
    render();
  }

  render() {
    this.resizeCanvas();
    const { data, context } = this;
    context.beginPath();
    this.line(data);
    context.lineWidth = 0.5;
    context.strokeStyle = this.color;
    context.stroke();
  }

  resizeCanvas() {
    const canvas = this.canvas.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  line(data) {
    const x = this.x(data);
    const y = this.y(data);
    const lineFn = line()
      .x(([time]) => x(time))
      .y(([, value]) => y(value))
      .curve(curveStep)
      .context(this.context);
    lineFn(data);
  }

  x(data = []) {
    const timeRange = this.timeRange || extent(data, ([time]) => time);
    return scaleTime()
      .range([0, this.width])
      .domain(this.timeRange);
  }

  y(data = []) {
    return scaleLinear()
      .range([this.height, 0])
      .domain(extent(data, ([, value]) => value));
  }
}
