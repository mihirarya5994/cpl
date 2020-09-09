import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";

import {
  AppService,
  AuthService,
  CountdownService,
  ICountdown,
  ExternalInterfaceService,
  AnalyticsService
} from "src/app/core";

import * as flickity from "flickity";

@Component({
  selector: "app-jcpa-tile",
  templateUrl: "./jcpa-tile.component.html",
  styleUrls: ["./jcpa-tile.component.scss"]
})
export class JcpaTileComponent implements OnInit, AfterViewInit {
  @Input() games: any[] = [];
  nextGameStartTime;

  jcpaSlider;

  selectedIndex = 0;
  loading = false;
  @ViewChild("jcpaLauncher", { static: true }) jcpaLauncherSlider: ElementRef;
  constructor(
    private appService: AppService,
    private authService: AuthService,
    private countdownService: CountdownService,
    private externalInterfaceService: ExternalInterfaceService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.countdownService
      .getCountdownStream()
      .subscribe((countdown: ICountdown) => {
        this.nextGameStartTime = countdown;
        if (
          countdown.days === 0 &&
          countdown.hours === 0 &&
          countdown.minutes === 0 &&
          countdown.seconds === 0
        ) {
          this.games[this.selectedIndex].started = true;
        }
      });

    this.countdownService.startCountdown(
      new Date(this.games[this.selectedIndex].startTime)
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initSlider();
      this.loading = false;
    }, 300);
  }

  initSlider() {
    this.jcpaSlider = new flickity(this.jcpaLauncherSlider.nativeElement, {
      prevNextButtons: false,
      autoPlay: false,
      pageDots: true,
      wrapAround: true
    });

    this.countdownService.startCountdown(
      new Date(this.games[this.selectedIndex].startTime)
    );

    this.jcpaSlider.on("select", i => {
      this.selectedIndex = i;
      this.countdownService.startCountdown(
        new Date(this.games[this.selectedIndex].startTime)
      );
    });
  }

  play(game) {
    this.analyticsService.clickTrack("Play Now | Banner", "SS | Home Page", {
      match: `${game.teams[0].name} vs ${game.teams[1].name}`
    });
    this.externalInterfaceService.launchBrowser(
      this.appService.getConfigParam("JCPA_URL")
    );
  }
}
