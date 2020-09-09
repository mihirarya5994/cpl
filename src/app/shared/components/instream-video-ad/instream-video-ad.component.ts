import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { AppService } from "src/app/core";
declare const VMAXSDK: any;

@Component({
  selector: "app-instream-video-ad",
  templateUrl: "./instream-video-ad.component.html",
  styleUrls: ["./instream-video-ad.component.scss"]
})
export class InstreamVideoAdComponent implements OnInit, AfterViewInit {
  @Input() contextName;
  @ViewChild("instreamAd", { static: true }) adElement: ElementRef;
  @Output() onVideoEnd: EventEmitter<any> = new EventEmitter();
  type;
  placementId = "ad_" + Date.now();
  config: any = {
    adComponentId: "ad_" + Date.now(),
    language: null,
    currentAdId: null,
    adId: null,
    type: null
  };

  constructor(private appService: AppService) {}

  ngOnInit() {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.config = {
        ...this.config,
        ...this.appService.getContentConfig().ads[this.contextName]
      };
      if (
        this.config.adId &&
        this.adElement &&
        this.config.currentAdId !== this.config.adId
      ) {
        this.adElement.nativeElement.setAttribute(
          "data-language-of-article",
          this.config.language
        );
        this.adElement.nativeElement.setAttribute(
          "data-adspot-key",
          this.config.adId
        );
        this.adElement.nativeElement.setAttribute(
          "id",
          this.config.adComponentId
        );
        this.adElement.nativeElement.setAttribute(
          "data-language-of-article",
          this.config.language
        );
      }
    });
    this.setUpInstreamAdsCallbacks();
  }

  setUpInstreamAdsCallbacks() {
    VMAXSDK.onAdReady = (placementId, adUXType) => {
      VMAXSDK.showAd(placementId, "instream_video");
    };

    VMAXSDK.onAdError = function(placementId, errorString) {
      console.log(
        "oops something went wrong" + JSON.stringify(errorString) + placementId
      );
    };

    VMAXSDK.onAdClose = placementId => {};

    VMAXSDK.onAdClick = function(p, q) {
      console.info("CB: Callback onAdClick ...", p, q);
    };

    VMAXSDK.onAdMediaEnd = (p, q) => {
      this.onVideoEnd.emit();
      console.log("CB : Media ended.", p, q);
    };
  }

  ngOnDestroy() {
    if (this.placementId) {
      console.log("ad is closed");
      this.placementId = null;
    }
  }
}
