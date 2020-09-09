import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";

import {
  EventEmitterService,
  EventData,
  TrackerService,
  ProfileService,
  AnalyticsService
} from "src/app/core";

@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.scss"]
})
export class DemoComponent implements OnInit {
  @ViewChild("video", { static: false }) video: ElementRef;
  @Output() close: EventEmitter<any> = new EventEmitter();

  showDemo = false;
  demoStarted = false;

  constructor(
    private eventEmitterService: EventEmitterService,
    private profileService: ProfileService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === "SHOW_DEMO") {
        this.showDemo = event.data;
        this.analyticsService.clickTrack("Demo Pop-up", "SS | Demo Pop-up");
      }
    });
  }

  skip() {
    this.analyticsService.clickTrack("Skip", "SS | Demo Pop-up");
    this.closeDemo();
    (this.video.nativeElement as HTMLVideoElement).pause();
  }

  start() {
    this.analyticsService.clickTrack("Start Demo", "SS | Demo Pop-up");
    this.profileService.setDemoCompleted().subscribe(() => {});
    try {
      (this.video.nativeElement as HTMLVideoElement).play();
      this.demoStarted = true;
      this.analyticsService.pageLoad(null, "SS | Demo Video Page");
    } catch (e) {
      this.closeDemo();
    }
  }
  closeDemo() {
    this.close.emit();
    this.showDemo = false;
  }
  markDemoComplete() {
    this.profileService.setDemoCompleted().subscribe(() => {
      this.demoStarted = false;
      this.closeDemo();
    });
  }
}
