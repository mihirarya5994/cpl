import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { EventEmitterService, EventData } from "src/app/core";

@Component({
  selector: "app-full-page-ads",
  templateUrl: "./full-page-ads.component.html",
  styleUrls: ["./full-page-ads.component.scss"]
})
export class FullPageAdsComponent implements OnInit {
  show = false;
  sound = true;
  contextName = null;

  data;

  @Output() skipAd: EventEmitter<any> = new EventEmitter();

  constructor(private eventEmitterService: EventEmitterService) {}

  ngOnInit() {
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === "SHOW_FULL_AD") {
        this.contextName = event.data.contextName;
        this.data = event.data;
        this.show = true;
      }
    });
  }

  skip() {
    this.show = false;
    if (this.data.value === "CREATE_TEAM_PATH") {
      this.eventEmitterService.emit({ type: "AD_CLOSED", data: null });
    }
  }

  toggleSound() {
    this.sound = !this.sound;
  }
}
