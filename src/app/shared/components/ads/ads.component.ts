import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";

import { AppService, ProfileService } from "./../../../core";

@Component({
  selector: "app-ads",
  templateUrl: "./ads.component.html",
  styleUrls: ["./ads.component.scss"]
})
export class AdsComponent implements AfterViewInit, OnChanges {
  @ViewChild("ad", { static: true }) adElement: ElementRef;

  @Input() contextName;

  config: any = {
    adComponentId: "ad_" + Date.now(),
    language: null,
    currentAdId: null,
    adId: null,
    type: null
  };

  constructor(
    private profileService: ProfileService,
    private appService: AppService
  ) {
    this.config.adComponentId = `ad_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    this.config.language = this.profileService.getProfileSync().language;
  }

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
  }

  ngOnChanges() {
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
    }
  }
}
