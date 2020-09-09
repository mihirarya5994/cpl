import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AnalyticsService } from 'src/app/core';

@Component({
  selector: "app-exit-popup",
  templateUrl: "./exit-popup.component.html",
  styleUrls: ["./exit-popup.component.scss"]
})

export class ExitPopupComponent implements OnInit {
  @Output() action: EventEmitter<any> = new EventEmitter();
  constructor(
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {}

  handleCta(action, traceKey) {
    this.analyticsService.clickTrack(traceKey, "SS | Exit Popup");
    this.action.emit(action);
  }
}
