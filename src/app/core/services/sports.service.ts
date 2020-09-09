import { Injectable } from "@angular/core";

import { map } from "rxjs/operators";

import { AppService } from "./app.service";
import { RestService } from "./rest.service";

import { ITeam, IMatch, IPlayer } from "../../models";
import { ALL_SPORTS, TEAMS, PLAYERS, ROOM_SPONSORS } from "../../constants";

@Injectable({
  providedIn: "root"
})
export class SportsService {
  userTeams;
  constructor(
    private appService: AppService,
    private restService: RestService
  ) {}

  getScheduledMatchesForType(gameType) {
    return this.restService
      .get(
        `${this.appService.getConfigParam(
          "API_HOST"
        )}/game/${gameType}/upcomingevents`
      )
      .pipe(
        map(matches => (Array.isArray(matches) ? matches : [])),
        map((matches: IMatch[]) => {
          matches.forEach(
            (match: IMatch) => (match.teams = this.resolveTeams(match.teams))
          );
          return matches;
        })
      );
  }

  getSportsTypes() {
    return this.restService
      .get(`${this.appService.getConfigParam("API_HOST")}/games`)
      .pipe(map(sports => sports.map(sport => ALL_SPORTS[sport])));
  }

  getMatchDetails(gameType, eventId) {
    return this.restService
      .get(
        `${this.appService.getConfigParam(
          "API_HOST"
        )}/game/${gameType}/event/${eventId}`
      )
      .pipe(
        map(details => ({
          ...details,
          players: this.resolvePlayers(details.players),
          teams: this.resolveTeams(details.teams)
        }))
      );
  }

  createTeam(team) {
    return this.restService.post(
      `${this.appService.getConfigParam("API_HOST")}/game/${
        team.gameType
      }/events/${team.eventId}/userteam`,
      team
    );
  }

  editTeam(team) {
    return this.restService.put(
      `${this.appService.getConfigParam("API_HOST")}/game/${
        team.gameType
      }/event/${team.eventId}/userteam`,
      team
    );
  }

  joinRoom(roomId) {
    return this.restService.post(
      `${this.appService.getConfigParam("API_HOST")}/sponsor/joinRoom`,
      [{ roomId }]
    );
  }

  joinRoomWithExisting(gameType, eventId, roomId, userTeamId) {
    var payload = { gameType: gameType, eventId: eventId, roomId: roomId };

    return this.restService.post(
      `${this.appService.getConfigParam(
        "API_HOST"
      )}/game/${gameType}/events/${eventId}/joinroom/${userTeamId}`,
      {
        ...payload
      }
    );
  }

  getMyMatches(gameType, event = "upcoming") {
    return this.restService
      .get(
        `${this.appService.getConfigParam(
          "API_HOST"
        )}/my_matches?game=${gameType}&event=${event}`
      )
      .pipe(
        map(matches => (Array.isArray(matches) ? matches : [])),
        map(matches => {
          matches.forEach(match => this.resolveTeams(match.teams));
          return matches;
        })
      );
  }

  getMyTeam(gameType, eventId, roomId) {
    return this.restService
      .get(
        `${this.appService.getConfigParam(
          "API_HOST"
        )}/game/${gameType}/event/${eventId}/room/${roomId}/myteam`
      )
      .pipe(
        map(team => ({ ...team, players: this.resolvePlayers(team.players) }))
      );
  }

  getUserTeams(gameType, eventId) {
    return this.restService
      .get(
        `${this.appService.getConfigParam(
          "API_HOST"
        )}/game/${gameType}/event/${eventId}/userteam`
      )
      .pipe(map(userteam => (this.userTeams = userteam)));
  }

  getUserTeamByID(teamId) {
    return this.userTeams.filter(team => team._id === teamId);
  }

  resolvePlayers(players) {
    if (players && players.length) {
      return players.map((player: IPlayer) => {
        player.team = this.resolveTeams([{ teamId: player.teamId }])[0];
        return Object.assign(player, PLAYERS[player.playerId]);
      });
    }
  }

  resolveTeams(teams) {
    return teams.map((team: ITeam) => Object.assign(team, TEAMS[+team.teamId]));
  }

  resolveRooms(rooms) {
    return rooms.map(room => ({
      ...room,
      icon: ROOM_SPONSORS[room.sponsorName],
      closed: room.currentParticipants === room.maxParticipants
    }));
  }

  getAllRooms(eventId) {
    return this.restService
      .get(
        `${this.appService.getConfigParam(
          "API_HOST"
        )}/sponsor/event/${eventId}/rooms?category=all`
      )
      .pipe(
        map(rooms => (Array.isArray(rooms) ? rooms : [])),
        map(rooms => this.resolveRooms(rooms))
      );
  }

  getUserRooms(eventId) {
    return this.restService.get(
      `${this.appService.getConfigParam(
        "API_HOST"
      )}/user/event/${eventId}/rooms`
    );
  }

  getEventTossInfo(eventId) {
    return this.restService.get(
      `${this.appService.getConfigParam(
        "API_HOST"
      )}/event/${eventId}/eventQuestion`
    );
  }
  updateEventTossInfo(eventId, questionId, payload) {
    return this.restService.post(
      `${this.appService.getConfigParam(
        "API_HOST"
      )}/event/${eventId}/eventQuestion/${questionId}/answer`,
      payload
    );
  }
}
