import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SportsService, AnalyticsService } from 'src/app/core';

@Component({
  selector: 'app-match-filter',
  templateUrl: './match-filter.component.html',
  styleUrls: ['./match-filter.component.scss']
})
export class MatchFilterComponent implements OnInit {
  @Output() selection: EventEmitter<string> = new EventEmitter();
  @Input() selectedType;
  tabs = [
    { index: 1, id: 'upcoming', title: 'UPCOMING', trackkey: 'Upcoming' },
    { index: 2, id: 'live', title: 'LIVE', trackkey: 'Live' },
    { index: 3, id: 'past', title: 'PAST', trackkey: 'Past' }
  ];
  matches$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sportsService: SportsService,
    private analyticsService: AnalyticsService
    ) {}

  ngOnInit() {
    // check if any live matches exist and switch
    this.matches$ = this.sportsService.getMyMatches('cricket', 'live').subscribe((res) => {
      if (res && res.length && res.length > 0) {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
          this.selectedType = params.get('typeId') || this.tabs[1].id;
          this.setTab(this.selectedType);
        });
      } else {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
          this.selectedType = params.get('typeId') || this.tabs[0].id;
          this.setTab(this.selectedType);
        });
      }
    });
  }

  setTab(tab, trackkey= null) {
    this.selectedType = tab;
    if (trackkey) {
      this.analyticsService.clickTrack(trackkey , 'SS | My Match Page');
    }
    this.selection.emit(this.selectedType);
  }
}
