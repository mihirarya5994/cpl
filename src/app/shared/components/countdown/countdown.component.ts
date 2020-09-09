import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";

import { interval, Subscription } from "rxjs";

import { AppService } from "./../../../core";

interface ICountdown {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

@Component({
  selector: "app-countdown",
  templateUrl: "./countdown.component.html",
  styleUrls: ["./countdown.component.scss"]
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() date: any = {};
  countdown: ICountdown = {};
  subscription: Subscription;
  @Output() finish: EventEmitter<any> = new EventEmitter();
  constructor(private appService: AppService) {}

  ngOnInit() {
    this.stopCountdown();
    this.date = new Date(this.date);
    if (this.date > new Date()) {
      this.subscription = interval(1000).subscribe(
        () => (this.countdown = this.calculateTimeLeft(this.date))
      );
      this.countdown = this.calculateTimeLeft(this.date);
    } else {
      this.finish.emit();
      this.countdown = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }
  }

  calculateTimeLeft(futureDate) {
    const clientOffset = this.appService.getCurrentTimeOffset();
    const diff = Math.floor(
      (futureDate.valueOf() - new Date().valueOf() + clientOffset) / 1000
    );
    if (diff <= 0) {
      this.finish.emit();
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    } else {
      return this.convertMillisecondsToHMS(diff);
    }
  }

  convertMillisecondsToHMS(millis) {
    const days = Math.floor(millis / (24 * 60 * 60));
    millis -= days * 86400;
    const hours = Math.floor(millis / (60 * 60));
    millis -= hours * 3600;
    const minutes = Math.floor(millis / 60) % 60;
    millis -= minutes * 60;
    const seconds = millis % 60;

    return {
      days,
      hours,
      minutes,
      seconds
    };
  }

  stopCountdown() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.stopCountdown();
  }
}
