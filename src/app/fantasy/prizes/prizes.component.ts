import { Component, OnInit } from "@angular/core";

import {
  TrackerService,
  AppService,
  RestService,
  AnalyticsService
} from "src/app/core";

@Component({
  selector: "app-prizes",
  templateUrl: "./prizes.component.html",
  styleUrls: ["./prizes.component.scss"]
})
export class PrizesComponent implements OnInit {
  prizes;
  //  = [
  //   {
  //     name: 'Paytm',
  //     desc: 'You have won Rs100 for completing the level. Redeem your coupon below.',
  //     couponCode: 'KH2345-HY563899',
  //     expiryDate: Date.now(),
  //     claimUrl: 'some url',
  //     img: null
  //   },
  //   {
  //     name: 'Swiggy',
  //     desc: 'You have won Rs100 for completing the level. Redeem your coupon below.',
  //     couponCode: 'KH2345-HY563899',
  //     expiryDate: Date.now(),
  //     claimUrl: 'some url',
  //     img: null
  //   }
  // ];

  constructor(
    private trackerService: TrackerService,
    private appService: AppService,
    private restService: RestService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Prizes Page");

    this.restService
      .get(
        this.appService.getConfigParam("COUPON_API_HOST") +
          "/winnerDetails?programName=WCSS2019"
      )
      .subscribe((res: any) => {
        //this.prizes = res;
        this.prizes = res.winnerDetails;
      });
  }

  copy(coupon) {
    this.analyticsService.clickTrack("Copy", coupon.couponName);
  }

  claim(coupon) {
    this.analyticsService.clickTrack("Claim", coupon.couponName);
  }
}
