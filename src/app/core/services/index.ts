import { LocalStorageService } from "./local-storage.service";
import { AuthService } from "./auth.service";
import { AppService } from "./app.service";
import { EventEmitterService } from "./event-emitter.service";
import { ExternalInterfaceService } from "./external-interface.service";
import { LoggerService } from "./logger.service";
import { ProfileService } from "./profile.service";
import { RestService } from "./rest.service";
import { UtilService } from "./util.service";
import { SportsService } from "./sports.service";
import { RouterService } from "./router.service";
import { SocketService } from "./socket.service";
import { GameService } from "./game.service";
import { PlayersService } from "./players.service";
import { CountdownService } from "./countdown.service";
import { TrackerService } from "./tracker.service";
import { AnalyticsService } from "./analytics.service";

export * from "./app.service";
export * from "./auth.service";
export * from "./event-emitter.service";
export * from "./external-interface.service";
export * from "./logger.service";
export * from "./profile.service";
export * from "./rest.service";
export * from "./util.service";
export * from "./local-storage.service";
export * from "./sports.service";
export * from "./router.service";
export * from "./socket.service";
export * from "./game.service";
export * from "./players.service";
export * from "./countdown.service";
export * from "./tracker.service";
export * from "./analytics.service";

export const services = [
  AppService,
  AuthService,
  EventEmitterService,
  ExternalInterfaceService,
  LoggerService,
  ProfileService,
  RestService,
  UtilService,
  LocalStorageService,
  SportsService,
  RouterService,
  SocketService,
  GameService,
  PlayersService,
  CountdownService,
  TrackerService,
  AnalyticsService
];
