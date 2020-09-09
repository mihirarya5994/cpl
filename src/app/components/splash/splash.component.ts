import { Router } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";

import {
  AppService,
  ExternalInterfaceService,
  ProfileService,
  TrackerService,
  AnalyticsService
} from "../../core";

@Component({
  selector: "app-splash",
  templateUrl: "./splash.component.html",
  styleUrls: ["./splash.component.scss"]
})
export class SplashComponent implements OnInit, OnDestroy {
  private timeoutId = null;
  loggedIn = false;
  profile: any;
  showProfileCapturePopup = false;
  isCheckBoxTicked = false;
  showBottomwrap = false;
  constructor(
    private profileService: ProfileService,
    private router: Router,
    private appService: AppService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.getProfile();
    }, this.appService.getConfigParam("SPLASH_TIMEOUT"));
  }

  showTnc() {
    this.analyticsService.clickTrack("TnC", "SS | Proceed Page");
    this.externalInterfaceService.launchBrowser(
      this.appService.getConfigParam("TNC_URL")
    );
  }

  private getProfile() {
    this.profileService.getProfile().subscribe(
      profile => {
        this.profile = profile;
        this.trackSplash();
        this.profile["language"] = this.profile["language"] || "eng";
        this.appService.setIsSoundEnabled(profile.sound);
        this.appService.setAppLanguage(this.profile["language"]);
        this.loggedIn = true;
        if (this.profile["TnC"]) {
          this.enterGame();
        } else {
          this.showBottomwrap = true;
        }
      },
      err => {
        this.enterGame();
      }
    );
  }

  enterGame() {
    this.navigateToGame();
  }

  toggleProfileCapturePopup() {
    this.showProfileCapturePopup = !this.showProfileCapturePopup;
  }

  play() {
    this.analyticsService.clickTrack("Play Now", "SS | Proceed Page");
    this.profileService.updateProfile({ TnC: true }).subscribe(res => {
      this.router.navigate(["/fantasy"]);
    });
  }

  navigateToGame() {
    this.router.navigate(["/fantasy"]);
  }

  trackSplash() {
    if (this.profile["TnC"]) {
      this.analyticsService.pageLoad(null, "SS | Splash Page");
    } else {
      this.analyticsService.pageLoad(null, "SS | Proceed Page");
    }
  }
  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
