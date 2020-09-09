import { ITeam } from "./match";

export interface IPlayer {
  playerId: string;
  teamId: string;
  teamName: string;
  teamAlias: string;
  playerName: string;
  skill: string;
  points: number;
  playerPoints: number;
  icon?: string;
  team?: ITeam;
}
