import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import * as AOS from "aos";

import {
  AppService,
  AuthService,
  LoggerService,
  UtilService,
  ExternalInterfaceService,
  RouterService,
  RestService,
  AnalyticsService,
  EventEmitterService
} from "./core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private appService: AppService,
    private logger: LoggerService,
    private util: UtilService,
    private externalInterfaceService: ExternalInterfaceService,
    private routerService: RouterService,
    public authService: AuthService,
    private restService: RestService,
    private analyticsservice: AnalyticsService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    AOS.init({
      once: true,
      duration: 300, // values from 0 to 3000, with step 50ms
      easing: "ease" // default easing for AOS animations
    });
    this.externalInterfaceService.sendLoadComplete();

    this.translateService.setDefaultLang("eng");
    this.appService.setAppLanguage(
      this.appService.getAppLanguage()["language"]
    );

    this.externalInterfaceService.sendNativeBackControl(false);
    this.logger.setLogging(this.appService.getConfigParam("ENABLE_LOGS"));
    this.externalInterfaceService.requestAdParams();

    this.authService.setAppQuery({
      jwt: this.util.getParameterByName("jwt"),
      host: this.util.getParameterByName("host")
    });

    if (!this.authService.getIsAuthenticated()) {
      this.analyticsservice.pageLoad("Initial page ", "SS | White Screen");
    }
    this.routerService.listen();
    this.getServerTime();
  }
  demoCompleted() {
    this.eventEmitterService.emit({ type: "SHOW_DEMO", data: false });
  }
  getServerTime() {
    return this.restService
      .get(`${this.appService.getConfigParam("API_HOST")}/sync_time`)
      .subscribe(res => {
        const offset: any =
          new Date().valueOf() - new Date(res[0]).valueOf() || 0;
        this.appService.setCurrentTimeOffset(offset);
      });
  }
}
