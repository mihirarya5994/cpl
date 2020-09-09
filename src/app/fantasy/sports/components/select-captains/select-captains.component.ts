import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { AnalyticsService } from "src/app/core";

@Component({
  selector: "app-select-captains",
  templateUrl: "./select-captains.component.html",
  styleUrls: ["./select-captains.component.scss"]
})
export class SelectCaptainsComponent implements OnInit {
  @Input() team: any = {};
  @Input() match: any = {};
  @Output() selection: EventEmitter<any> = new EventEmitter();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Captain Selection Page");
  }

  select(type, player, trackkey) {
    this.analyticsService.clickTrack(trackkey, "SS | Captain Selection Page");
    this.selection.emit({
      [type]: player.playerId
    });
  }
}
