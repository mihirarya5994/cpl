import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";

import { Subject } from "rxjs";

import { AppService } from "./app.service";
import { AuthService } from "./auth.service";
import { LoggerService } from "./logger.service";
import { EventEmitterService } from "./event-emitter.service";

declare const window: any;
declare const webkit: any;

@Injectable({
  providedIn: "root"
})
export class ExternalInterfaceService {
  public subject$: Subject<any> = new Subject();

  constructor(
    private zone: NgZone,
    private router: Router,
    private appService: AppService,
    private authService: AuthService,
    private logger: LoggerService,
    private eventEmitterService: EventEmitterService
  ) {
    this.setupCallbacksFromNative();
  }

  share(data) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "share",
          desc: data
        })
      )
    );
  }

  playSound(audioObj) {
    this.stopSound();
    if (["true", true].includes(this.appService.getIsSoundEnabled())) {
      this.externalCall(
        btoa(
          JSON.stringify({
            type: "playinternalsound",
            path: audioObj.path || null,
            loop: audioObj.loop || false,
            name: audioObj.name || null
          })
        )
      );
    }
  }

  stopSound() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "stopsound"
        })
      )
    );
  }

  launchBrowser(url) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "launchbrowser",
          value: url
        })
      )
    );
  }

  sendLoadComplete() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "loadingCompleted"
        })
      )
    );
  }

  close() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "close"
        })
      )
    );
  }

  requestJWT() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "jwt"
        })
      )
    );
  }

  sendNativeBackControl(data) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "handleWebviewBack",
          value: data
        })
      )
    );
  }

  requestMicrophone() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "microphone",
          config: {
            type: "speech",
            language: "en"
          }
        })
      )
    );
  }

  makeCall(value) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "makeCall",
          value: value
        })
      )
    );
  }

  requestScreenshot() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "screenshot"
        })
      )
    );
  }

  requestForUserPermission(permission) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "requestForUserPermission",
          value: permission
        })
      )
    );
  }

  requestAdParams() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "adparams"
        })
      )
    );
  }

  getNativeVersion(permission) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "getNativeVersion"
        })
      )
    );
  }

  private externalCall(data) {
    try {
      if (window.android && window.android.__externalCall) {
        window.android.__externalCall(data);
      }
      if (window.__externalCall) {
        window.__externalCall(data);
      }
      webkit.messageHandlers.callback.postMessage(data);
    } catch (e) {
      this.logger.error("external call failed");
    }
  }

  public setupCallbacksFromNative() {
    window.sendJwt = jwt => {
      this.zone.run(() => {
        this.authService.setAuthInfo({ jwt: jwt });
        this.router.navigate(["/"]);
      });
    };

    window.sendJWT = jwt => {
      this.zone.run(() => {
        this.authService.setAuthInfo({ jwt: jwt });
        this.router.navigate(["/"]);
      });
    };

    window.handleBackKey = () => {
      this.zone.run(() => {
        this.eventEmitterService.emit({
          type: "NATIVE_BACK_CLICKED",
          data: ""
        });
      });
    };

    window.sendTextForSpeech = text => {
      // alert(text);
      this.eventEmitterService.emit({ type: "TEXT_FROM_NATIVE", data: text });
    };

    window.sendScreenshot = text => {
      // alert(text);
      // this.eventEmitterService.emit({ type: 'TEXT_FROM_NATIVE', data: text });
    };

    window.sendNativeVersion = text => {
      alert(text);
      // this.eventEmitterService.emit({ type: 'TEXT_FROM_NATIVE', data: text });
    };

    window.sendAdParams = params => {
      // params will have latitude, longitude, Adid, OS
      this.logger.log(
        "Params from sendAdParams for Adid" + JSON.stringify(params)
      );
      let userIfa = "";
      let lat, long;
      if (this.appService.getOS() === "ios") {
        userIfa = JSON.parse(params).Adid;
        lat = JSON.parse(params).latitude;
        long = JSON.parse(params).longitude;
      } else {
        userIfa = params.Adid;
        lat = params.latitude;
        long = params.longitude;
      }
      window.AD_USER = {
        userIfa: userIfa,
        city: ""
      };
      window.AD_INFO = {
        lat: lat,
        lng: long
      };
      this.logger.log(
        "Adid passed to JioAds " + JSON.stringify(window.AD_USER)
      );
      this.eventEmitterService.emit({
        type: "AD_PARAMS",
        data: JSON.parse(params)
      });
    };

    window.ADSDKEXT = {};
    window.ADSDKEXT.click_handler = url => this.launchBrowser(url);
  }
}
