import { Component, OnInit } from "@angular/core";
import {
  EventEmitterService,
  EventData,
  TrackerService,
  ProfileService,
  AppService,
  AnalyticsService
} from "src/app/core";

@Component({
  selector: "app-daily-reward-popup",
  templateUrl: "./daily-reward-popup.component.html",
  styleUrls: ["./daily-reward-popup.component.scss"]
})
export class DailyRewardPopupComponent implements OnInit {
  showReward = false;
  dailyRewardPoint;
  constructor(
    private eventEmitterService: EventEmitterService,
    private appService: AppService,
    private analyticsService: AnalyticsService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === "SHOW_DAILY_REWARD") {
        this.dailyRewardPoint = event.data;
        this.showReward = true;
        this.analyticsService.clickTrack("Coins Pop-up", "SS | Coins Pop-up");
      }
    });
  }

  continue() {
    this.analyticsService.clickTrack("Continue | Coins", "SS | Coins Pop-up", {
      new_Value: this.appService.getConfigParam("DAILY_REWARD_POINTS")
    });
    this.profileService.updateServerProfile({ showLoginPoints: false });
    this.showReward = false;
  }
}
