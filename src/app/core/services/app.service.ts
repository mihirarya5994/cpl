import { Injectable } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class AppService {
  private config: any = {};
  private timeOffset = 0;
  private userProfile: any = {};
  private selectedLanguage = "eng";
  private soundEnabled = true;
  private contentConfig = null;

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.userProfile.language =
      this.localStorageService.getItem("language") || "eng";
    this.userProfile.sound = true;
  }

  setContentConfig(config) {
    this.contentConfig = config;
  }

  getContentConfig() {
    return this.contentConfig;
  }

  getIsSoundEnabled() {
    return (
      this.soundEnabled ||
      (typeof this.localStorageService.getItem("sound") !== "undefined"
        ? this.localStorageService.getItem("sound")
        : true)
    );
  }

  setIsSoundEnabled(val) {
    this.soundEnabled = val;
    this.localStorageService.addItem("sound", val);
  }

  setConfig(config) {
    this.config = config;
  }

  getConfigParam(param) {
    return this.config[param];
  }

  setCurrentTimeOffset(offset) {
    this.timeOffset = offset;
  }

  getCurrentTimeOffset() {
    return this.timeOffset;
  }

  setAppLanguage(langCode) {
    langCode = langCode || "eng";
    this.translateService.use(langCode);
    this.selectedLanguage = langCode;
    this.localStorageService.addItem("language", langCode);
  }

  getAppLanguage() {
    return (
      this.selectedLanguage || this.localStorageService.getItem("language")
    );
  }

  getOS() {
    if (navigator.userAgent.match(/Android/i)) {
      return "android";
    }
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return "ios";
    }
    return "others";
  }
}
