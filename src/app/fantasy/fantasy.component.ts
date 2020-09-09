import { Component, OnInit } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import {
  RouterService,
  RouteInfo,
  ProfileService,
  AppService,
  EventEmitterService,
  AnalyticsService,
  EventData
} from "../core";

@Component({
  selector: "app-fantasy",
  templateUrl: "./fantasy.component.html",
  styleUrls: ["./fantasy.component.scss"]
})
export class FantasyComponent implements OnInit {
  showFooter = true;

  constructor(
    private translate: TranslateService,
    private appService: AppService,
    private profileService: ProfileService,
    private routerService: RouterService,
    private eventEmitterService: EventEmitterService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.profileService.getServerProfile().subscribe(profile => {
      if (!profile.demoCompleted) {
        this.eventEmitterService.emit({ type: "SHOW_DEMO", data: true });
      } else {
        this.analyticsService.pageLoad(null, "SS | Home Page");
      }
      if (
        !profile.hasOwnProperty("showLoginPoints") ||
        profile.showLoginPoints
      ) {
        this.eventEmitterService.emit({
          type: "SHOW_DAILY_REWARD",
          data: profile.dailyLoginPoints
        });
      }
    });
    this.profileService.getProfile().subscribe(profile => {
      profile["language"] = profile["language"] || "eng";
      this.appService.setIsSoundEnabled(profile.sound);
      this.appService.setAppLanguage(profile["language"]);
    });

    this.routerService.getRouterState().subscribe((state: RouteInfo) => {
      this.showFooter =
        typeof state.data.showFooter === "undefined"
          ? true
          : state.data.showFooter;
    });
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === "SHOW_DEMO" && !event.data) {
        this.analyticsService.pageLoad(null, "SS | Home Page");
      }
    });
  }
}
