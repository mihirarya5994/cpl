import { Injectable } from "@angular/core";

import { Subject, of, throwError } from "rxjs";

import { SportsService } from "src/app/core";

class Team {
  players = [];
  captain = null;
  viceCaptain = null;
  questionsAttempted = [];

  constructor(team?) {
    if (team) {
      this.players = team.players;
      this.captain = team.captain;
      this.viceCaptain = team.viceCaptain;
      this.questionsAttempted = team.questionsAttempted;
    }
  }
}

@Injectable({
  providedIn: "root"
})
export class TeamCreationService {
  private teamUpdates$: Subject<any> = new Subject();
  private team: Team;
  private currentMatch;
  private currentRoom;

  constructor(private sportsService: SportsService) {}

  setCurrentMatch(match) {
    this.currentMatch = match;
  }

  getCurrentMatch() {
    return this.currentMatch;
  }

  setCurrentRoom(room) {
    this.currentRoom = room;
  }

  getCurrentRoom() {
    return this.currentRoom;
  }

  setTeam(team) {
    this.team = team;
  }

  getTeam(team?) {
    this.team = this.team || new Team(team);
    return this.team;
  }

  getAllTeamMembers() {
    return this.team.players;
  }

  addPlayer(player) {
    player.selected = true;
    this.team.players.push(player);
    this.updateTeam();
  }

  removePlayer(player) {
    player.selected = false;
    this.team.players.splice(
      this.team.players.findIndex(p => p.playerId === player.playerId),
      1
    );
    this.updateTeam();
  }

  predictToss(team) {
    this.team.questionsAttempted = [
      {
        questionId: this.currentMatch.questions[0]._id,
        userAnswer: team
      }
    ];
    this.updateTeam();
  }

  appointCaptains(event) {
    this.team = { ...this.team, ...event };
    this.updateTeam();
  }

  getTeamPlayersBySkill(skill) {
    return this.team.players.filter(player => player.skill === skill);
  }

  getTeamPlayersByCountry(teamId) {
    return this.team.players.filter(player => player.teamId === teamId);
  }

  updateTeam() {
    this.teamUpdates$.next(this.team);
  }

  getTeamUpdates() {
    return this.teamUpdates$;
  }

  createTeam(room: any) {
    if (this.team) {
      const team = this.team;
      const { gameType, eventId } = this.currentMatch;
      if (
        !(
          team.questionsAttempted &&
          team.questionsAttempted.length &&
          team.questionsAttempted[0].userAnswer
        )
      ) {
        delete team.questionsAttempted;
      }
      return this.sportsService.createTeam({
        ...team,
        gameType,
        eventId,
        roomId: room._id
      });
    } else {
      return throwError("no team");
    }
  }

  editTeam() {
    if (this.team) {
      const team = this.team;
      const { gameType, eventId } = this.currentMatch;
      return this.sportsService.editTeam({ ...team, gameType, eventId });
    } else {
      return throwError("no team");
    }
  }

  joinRoom(room) {
    return this.sportsService.joinRoom(room._id);
  }

  clear() {
    this.team = null;
    this.currentMatch = null;
    this.currentRoom = null;
  }
}
