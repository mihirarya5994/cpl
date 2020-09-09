import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

import { AppService } from "src/app/core/services/app.service";
import { ExternalInterfaceService } from "src/app/core/services/external-interface.service";
import { ProfileService, UtilService } from "src/app/core";

@Component({
  selector: "app-profile-capture",
  templateUrl: "./profile-capture.component.html",
  styleUrls: ["./profile-capture.component.scss"]
})
export class ProfileCaptureComponent implements OnInit {
  @Input() profile: any = {};
  @Output() close: EventEmitter<any> = new EventEmitter();

  selectedLanguage: any = null;
  languages: any[] = [];
  showLanguageSelection = false;
  digitalData;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private appService: AppService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private util: UtilService
  ) {}

  ngOnInit() {
    this.profile = this.util.clone(this.profile);
    this.languages = this.appService.getContentConfig().languages;
    if (this.profile.language) {
      this.selectedLanguage = this.languages.filter(
        l => this.profile.language === l.value
      )[0];
    } else {
      this.selectedLanguage = this.languages[0];
    }
  }

  selectLanguage(language) {
    this.selectedLanguage = language;
  }

  updateProfile() {
    this.profileService
      .updateProfile({
        nickName: this.profile.nickName
      })
      .subscribe(res => {
        // this.translateService.use(this.selectedLanguage.value);
        this.router.navigate(["/fantasy"]);
      });
  }

  enableLangSelection() {
    this.showLanguageSelection = true;
  }

  showTnC() {
    this.externalInterfaceService.launchBrowser(
      this.appService.getConfigParam("TNC_URL")
    );
  }

  hide() {
    this.close.emit();
  }
}
