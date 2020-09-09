import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

import { map } from "rxjs/operators";

import { SportsService } from "src/app/core";

@Component({
  selector: "app-toss",
  templateUrl: "./toss.component.html",
  styleUrls: ["./toss.component.scss"]
})
export class TossComponent implements OnInit {
  @Input() match: any = {};
  @Input() team: any = {};
  @Output() selection: EventEmitter<any> = new EventEmitter();
  toss = {
    result: null,
    userSelection: null,
    correctAnswer: false,
    wrongAnswer: false,
    allowed: true,
    _id: null
  };

  constructor(private sportsService: SportsService) {}

  ngOnInit() {
    this.checkToss();
  }

  checkToss() {
    this.sportsService
      .getEventTossInfo(this.match.eventId)
      .pipe(map(toss => toss[0]))
      .subscribe(toss => {
        this.toss._id = toss._id;
        if (toss.answer && toss.answer[0]) {
          this.toss.result = this.match.questions[0].options.filter(
            option => toss.answer[0] === option.id
          )[0];
          this.toss.allowed = false;
        }
        if (toss.userAnswer && toss.userAnswer[0]) {
          this.match.questions[0].options.forEach(option => {
            if (option.id === toss.userAnswer[0]) {
              this.toss.userSelection = option;
              this.selection.emit(option.id);
            }
          });
          if (toss.answer && toss.answer[0]) {
            this.toss.correctAnswer = toss.userAnswer[0] === toss.answer[0];
            this.toss.wrongAnswer = toss.userAnswer[0] !== toss.answer[0];
          }
          this.toss.allowed = false;
        }
      });
  }

  select(team) {
    if (this.toss.userSelection || !this.toss.allowed) {
      return;
    }
    this.match.questions[0].options.forEach(option => {
      if (option.teamId === team.id) {
        this.toss.userSelection = option;
        this.sportsService.updateEventTossInfo(this.match.eventId, this.toss._id, {
          "questionsAttempted" : [{
            "questionId" :  this.toss._id,
            "userAnswer" : option.id
          }]
        }).subscribe((res) => {
          this.selection.emit(option.id);
        });
      }
    });
  }
}
