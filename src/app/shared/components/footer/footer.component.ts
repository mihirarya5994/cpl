import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import {
  RouterService,
  RouteInfo,
  TrackerService,
  AnalyticsService
} from "src/app/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  links = [
    {
      id: "home",
      title: "Home",
      route: "/fantasy",
      icon: "home.png",
      activeIcon: "home_active.png",
      translationKey: "HOME",
      traceKey: "Home"
    },
    {
      id: "myMatch",
      title: "My Match",
      route: "/fantasy/my-matches",
      icon: "my_match.png",
      activeIcon: "my_match_active.png",
      translationKey: "MY_MATCH",
      traceKey: "My Match"
    },
    {
      id: "prizes",
      title: "Prizes",
      route: "/fantasy/prizes",
      icon: "prizes.png",
      activeIcon: "prizes_active.png",
      translationKey: "PRIZES",
      traceKey: "Prizes"
    },
    {
      id: "settings",
      title: "Settings",
      route: "/fantasy/settings",
      icon: "settings.png",
      activeIcon: "settings_active.png",
      translationKey: "SETTINGS",
      traceKey: "Settings"
    }
  ];
  activeLink = this.links[0];

  constructor(
    private router: Router,
    private routerService: RouterService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    const { url } = this.router;
    this.setActiveLink({ url });
    this.routerService.getRouterState().subscribe((state: RouteInfo) => {
      this.setActiveLink(state);
    });
  }

  navigate(link) {
    this.analyticsService.clickTrack(link.traceKey, "SS | Footer");
    this.activeLink = link;
    this.router.navigate([link.route]);
  }

  setActiveLink(state) {
    let activatedLink;
    if (state.url === "/fantasy/profile") {
      activatedLink = state.url;
      this.activeLink = this.links[3];
    } else if (state.url.indexOf("my-matches") >= 0) {
      this.activeLink = this.links[1];
    } else {
      activatedLink = this.links.filter(l => state.url.indexOf(l.route) >= 0);
      if (activatedLink) {
        this.activeLink =
          activatedLink.length > 0
            ? activatedLink[activatedLink.length - 1]
            : this.links[1];
      }
    }
  }
}
