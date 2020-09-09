import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';
import { LoggerService } from './logger.service';
import { UtilService } from './util.service';
import { ExternalInterfaceService } from './external-interface.service';

import { GameState, QuizState } from './../models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket;
  private gameChannel = null;
  private feedChannel = null;
  private gameState: GameState;
  private quizState: QuizState;
  private gameEvents$: Subject<any> = new Subject();
  private quizEvents$: Subject<any> = new Subject();

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private logger: LoggerService,
    private socketService: SocketService,
    private utilService: UtilService,
    private translate: TranslateService,
    private externalService: ExternalInterfaceService
  ) {}

  public initialize(match) {
    this.gameState = new GameState();
    this.gameState.match = match;
    this.connect();
  }

  private connect() {
    this.socket = this.socketService
      .getSocket()
      .on('unsubscribe', this.socketUnsubscriptionHandler.bind(this))
      .on('connect', this.socketConnectHandler.bind(this))
      .on('error', this.socketErrorHandler.bind(this));
  }

  private socketUnsubscriptionHandler(channelName) {
    this.logger.warn('UNSUBSCRIBED FROM ', channelName);
  }

  private socketConnectHandler() {
    this.logger.warn('SOCKET CONNECTED');
    this.doSocketLogin();
  }

  private socketErrorHandler(error) {
    this.logger.error('SOCKET ERROR > ', error);
    this.socketService.unsubscribe(this.socket, this.gameChannel);
    this.socketService.unsubscribe(this.socket, this.feedChannel);
  }

  private doSocketLogin() {
    this.socket.emit('login', { token: this.authService.getAuthInfo().jwt }, (err) => {
      if (!err) {
        this.updateGameState({ authenticated: true });
        this.registerGameEventsListener();
        this.registerGameFeedListener();
        this.getPointsOnSocket();
      } else {
        this.logger.error('socket login error ', err);
      }
    });
  }

  private registerGameEventsListener() {
    this.logger.warn(
      `Subscribing to game channel for ${
        this.gameState.match.id
      }_${this.appService.getAppLanguage() || 'eng'}`
    );
    this.gameChannel = this.socketService.subscribe(
      `${this.gameState.match.id}_${this.appService.getAppLanguage() || 'eng'}`,
      (event) => {
        this.logger.group('GAME EVENT: ' + event.eventName);
        this.logger.log('data : ', event);
        switch (event.eventName) {
          case 'player_user_count':
            this.handlePlayerUserCountEvent(event.data);
            break;
        }
        this.getPointsOnSocket();
        this.logger.groupEnd();
      }
    );
  }

  private getPointsOnSocket() {
    this.socketService.emit(this.socket, 'get_points', {}, (err, event) => {
      if (!err) {
        this.updateGameState({ userScore: event.points });
      }
    });
  }

  private handlePlayerUserCountEvent(data) {
    this.updateGameState({ participantsCount: +(data.user_count || 0) });
  }

  private registerGameFeedListener() {
    this.logger.warn(
      `Subscribing to feed channel for ${
        this.gameState.match.gameId
      }_${this.appService.getAppLanguage() || 'eng'}`
    );
    this.feedChannel = this.socketService.subscribe(
      `${this.gameState.match.gameId}_${this.appService.getAppLanguage() || 'eng'}`,
      (event) => {
        this.logger.group('FEED EVENT');
        this.logger.log('data > ', event.data);
        this.logger.groupEnd();
      }
    );
    this.getCurrentFeedOnSocket();
  }

  private getCurrentFeedOnSocket() {
    this.socketService.emit(
      this.socket,
      'current_feed',
      {
        channel: `${this.gameState.match.gameId}_${this.appService.getAppLanguage() || 'eng'}`
      },
      (err, res) => {
        if (!err) {
          this.logger.group('FEED EVENT');
          this.logger.log('data > ', res);
          const state: any = {
            feed: res
          };
          this.updateGameState(state);
          this.logger.groupEnd();
        } else {
          this.logger.error('error getting current feed ', err);
        }
      }
    );
  }

  private updateGameState(state, changeType?) {
    Object.assign(this.gameState, state);
    this.gameState = this.utilService.clone(this.gameState);
    // this.logger.warn('updated game state > ', this.gameState);
    this.gameEvents$.next(this.gameState);
  }

  getQuizState() {
    return this.quizState;
  }

  getGameState() {
    return this.gameState;
  }

  getGameEventsStream() {
    return this.gameEvents$;
  }

  getQuizEventsStream() {
    return this.quizEvents$;
  }

  reset() {
    this.gameState = new GameState();
    this.quizState = new QuizState();
  }

  dispose() {
    if (this.socket) {
      this.socketService.unsubscribe(this.socket, this.gameChannel);
      this.socketService.unsubscribe(this.socket, this.feedChannel);
      this.socketService.destroySocket();
      this.socket = null;
      this.gameChannel = null;
      this.feedChannel = null;
      this.reset();
    }
  }
}
