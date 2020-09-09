import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

import {
  AppService,
  ProfileService,
  ExternalInterfaceService,
  EventEmitterService,
  TrackerService,
  AnalyticsService
} from "src/app/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  profile;
  languages: any[] = [];
  showLanguageSelection = false;
  currentLanguageText;
  loading = true;

  constructor(
    private router: Router,
    private appService: AppService,
    private profileService: ProfileService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService,
    private translate: TranslateService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Settings Page");
    this.profileService.getProfile().subscribe(
      res => {
        this.profile = res;
        if (this.profile.avatar) {
          this.profile[
            "avatarImg"
          ] = this.appService
            .getContentConfig()
            .avatars.filter(a => a.id === this.profile.avatar)[0].imgUrl;
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
    this.languages = this.appService.getContentConfig().languages;
  }

  showProfile(trackkey) {
    this.analyticsService.clickTrack(trackkey, "SS | Settings Page");
    this.router.navigate(["/fantasy/profile"]);
  }

  toggleSound(trackkey) {
    this.analyticsService.clickTrack(trackkey, "SS | Settings Page");
    this.profileService
      .updateProfile({ sound: this.profile.sound })
      .subscribe();
    this.appService.setIsSoundEnabled(this.profile.sound);
  }

  toggleLanguageSelectionPopup() {
    this.showLanguageSelection = !this.showLanguageSelection;
  }

  changeLanguage(language, trackkey) {
    this.analyticsService.clickTrack(trackkey, "SS | Settings Page");
    this.profileService.updateProfile({ language }).subscribe(() => {
      this.appService.setAppLanguage(language);
      this.profile.language = language;
      this.toggleLanguageSelectionPopup();
    });
    this.profileService.updateServerProfile({ language });
  }

  getLanguageText() {
    if (this.profile.language) {
      return this.languages.filter(l => l.value === this.profile.language)[0]
        .title;
    } else {
      return this.languages[0].title;
    }
  }

  launchUrl(type, trackkey) {
    switch (type) {
      case "how-to-play":
        this.externalInterfaceService.launchBrowser(
          this.appService.getConfigParam("HOW_TO_PLAY_URL")
        );
        break;
      case "faq":
        this.externalInterfaceService.launchBrowser(
          this.appService.getConfigParam("FAQ_URL")
        );
        break;
      case "tnc":
        this.externalInterfaceService.launchBrowser(
          this.appService.getConfigParam("TNC_URL")
        );
        break;
      case "invite":
        this.translate.get("SHARE_MESSAGE").subscribe(res => {
          this.externalInterfaceService.share(
            this.appService.getConfigParam("JCPA_URL")
          );
        });
        break;
    }
    this.analyticsService.clickTrack(trackkey, "SS | Settings Page");
  }

  showDemo() {
    this.eventEmitterService.emit({ type: "SHOW_DEMO", data: true });
  }
}
