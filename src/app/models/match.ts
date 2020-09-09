export interface IMatch {
  eventId: string;
  eventType: string;
  gameId: string;
  gameType: string;
  startTime: string;
  status: string;
  teams: ITeam[];
  title: string;
  venue: { city: string; stadium: string; time: string };
  userTeamId?: string;
  rooms?: any[];
  active: boolean;
  eventQuestions?: any;
}
export interface ITeam {
  alias: string;
  name: string;
  teamId: string;
  icon?: string;
  players?: any[];
}
