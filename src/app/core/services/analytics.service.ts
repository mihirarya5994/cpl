import { Injectable } from "@angular/core";
import { AppService } from "./app.service";
import { Router } from "@angular/router";
import { LoggerService } from "./logger.service";

declare const dataLayer: any;

@Injectable({
  providedIn: "root"
})
export class AnalyticsService {
  constructor(
    private appService: AppService,
    private router: Router,
    private logger: LoggerService
  ) {}

  pageLoad(pageUrl, pageTitle) {
    var pageData: any = {};
    try {
      pageData = {
        event: "virtualPageView",
        virtualPageURL: this.router.url,
        virtualPageTitle: pageTitle,
        appName: "Super Squad",
        env: this.appService.getConfigParam("ENV")
      };
      dataLayer.push(pageData);
    } catch (e) {
      this.logger.error("Error tracking Page");
    }
  }

  clickTrack(action, label, extras?) {
    var linkData: any = {};
    try {
      if (extras) {
        linkData = {
          event: "superSquad",
          new_Category: "Super Squad",
          new_Label: label,
          new_Action: action,
          ...extras
        };
        dataLayer.push(linkData);
      } else {
        linkData = {
          new_Category: "Super Squad",
          new_Label: label,
          new_Action: action,
          event: "superSquad"
        };
        dataLayer.push(linkData);
      }
    } catch (e) {
      this.logger.error("Error tracking Link");
    }
  }
}
