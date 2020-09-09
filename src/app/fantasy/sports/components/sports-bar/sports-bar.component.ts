import { Component, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { ISport } from '../../../../models';

import { SportsService } from '../../../../core';

@Component({
  selector: 'app-sports-bar',
  templateUrl: './sports-bar.component.html',
  styleUrls: ['./sports-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SportsBarComponent implements OnInit {
  @Output() selection: EventEmitter<any> = new EventEmitter();

  sports: ISport[] = [];

  constructor(private sportsService: SportsService) {}

  ngOnInit() {
    this.sportsService.getSportsTypes().subscribe((sports) => {
      this.sports = sports;
      this.selectSport(this.sports[0]);
    });
  }

  selectSport(sport) {
    this.sports.forEach((s) => (s.active = false));
    sport.active = true;
    this.selection.emit(sport);
  }
}
