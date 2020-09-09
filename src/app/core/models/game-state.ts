export class GameState {
  match: any = null;

  // socket authenticated
  authenticated = false;
  // current match
  gameInfo = null;
  // user score
  userScore = 0;
  // level
  userLevel = 0;
  // game participants
  participantsCount = 0;
  // over id
  overId = null;
  // current game questions
  questions = null;
  // current extras question
  extrasQuestion = null;
  // game feed
  feed = null;
  // game current state
  currentState = null;
  // game experts
  experts = [];
  // selected expert
  selectedExpert = null;
  // expert status
  expertStatus = null;
  // game boosters
  boosters = [];
  // selected booster
  selectedBooster = null;
  // show current game state
  showCurrentGameState = false;
  // check if Powerplay is On
  enablePP = false;
  enableFH = false;
  // check if Expert advice is On
  enableEA = false;
  // show ads
  showAds4 = false;
  showAds6 = false;
  showAdsW = false;
  showAds = false;
  isInningsBreak = false;
  // enable Animations
  showAnimation = false;
  animation = {};
}
