import { Injectable } from "@angular/core";

import { tap } from "rxjs/operators";

declare const window: any;

import { AppService } from "./app.service";
import { RestService } from "./rest.service";
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  private profile: any = {};
  private adParamsSent = false;

  constructor(
    private appService: AppService,
    private restService: RestService,
    private logger: LoggerService
  ) {}

  getProfile() {
    return this.restService
      .get(
        this.appService.getConfigParam("PROFILE_API_HOST") +
          "/api/users/my_profile"
      )
      .pipe(
        tap(res => {
          this.profile = res;
          this.appService.setAppLanguage(this.profile.language);
          if (window.AD_USER && !this.adParamsSent) {
            window.AD_USER.city = "" + res.city + ";" + res.region;
            this.logger.log(
              "Adid passed to JioAds" + JSON.stringify(window.AD_USER)
            );
            this.adParamsSent = true;
          }
        })
      );
  }

  getProfileSync() {
    return this.profile;
  }

  updateProfile(profile) {
    Object.assign(this.profile, profile);
    return this.restService.put(
      this.appService.getConfigParam("PROFILE_API_HOST") +
        "/api/users/my_profile",
      profile
    );
  }

  updateServerProfile(profile) {
    Object.assign(this.profile, profile);
    return this.restService
      .put(this.appService.getConfigParam("API_HOST") + "/my_profile", profile)
      .subscribe();
  }

  getScore() {
    return this.restService.get(
      this.appService.getConfigParam("API_HOST") + "/api/user/score"
    );
  }

  getMatchDetails() {
    return this.restService.get(
      this.appService.getConfigParam("API_HOST") + "/api/user/match_details"
    );
  }

  getServerProfile() {
    return this.restService
      .get(this.appService.getConfigParam("API_HOST") + "/my_profile")
      .pipe(
        tap(res => {
          this.profile = res;
          this.appService.setAppLanguage(this.profile.language);
          if (window.AD_USER) {
            window.AD_USER.city = "" + res.city + ";" + res.region;
            this.logger.log(
              "Adid passed to JioAds" + JSON.stringify(window.AD_USER)
            );
          }
        })
      );
  }

  setDemoCompleted() {
    Object.assign(this.profile, { demoCompleted: true });
    return this.restService.post(
      this.appService.getConfigParam("API_HOST") + "/user/demo_completed",
      {
        demoCompleted: true
      }
    );
  }
  profileCompleted() {
    Object.assign(this.profile, { profilePending: false });
    return this.restService
      .post(
        this.appService.getConfigParam("API_HOST") +
          "/api/user/profileCompleted",
        {
          profilePending: false
        }
      )
      .subscribe(res => {
        return;
      });
  }
}
