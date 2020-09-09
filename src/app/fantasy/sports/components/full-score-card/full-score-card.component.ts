import { TeamCreationService } from './../../services/team-creation.service';
import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-full-score-card',
  templateUrl: './full-score-card.component.html',
  styleUrls: ['./full-score-card.component.scss']
})
export class FullScoreCardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scoreCardFrame', { static: true }) scoreCardFrame: ElementRef;
  @Output() close: EventEmitter<any> = new EventEmitter();

  showScoreCard = false;
  iframe: HTMLIFrameElement;
  loading = true;

  constructor(private appService: AppService, private teamCreationService: TeamCreationService) {}

  ngAfterViewInit() {
    this.iframe = document.createElement('iframe');
    this.iframe.style.minHeight = '100%';
    this.iframe.style.minWidth = '100%';
    this.iframe.style.border = 'none';
    this.iframe.style.padding = '0 15px';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.setAttribute('scrolling', 'true');
    this.iframe.addEventListener('load', (e) => {
      this.handleIframeLoad(e);
    });

    setTimeout(() => {
      if (this.teamCreationService.getCurrentMatch().gameId && this.appService.getAppLanguage()) {
        this.iframe.src = `${this.appService
          .getConfigParam('SI_SCORE_CARD_URL')
          .replace('$1', this.teamCreationService.getCurrentMatch().gameId)
          .replace('$2', this.appService.getAppLanguage())}`;
      }
      this.scoreCardFrame.nativeElement.appendChild(this.iframe);
    });

    document.body.classList.add('scroll-lock');
  }

  toggleScoreCard() {
    this.close.emit();
  }

  handleIframeLoad($event) {
    this.loading = false;
  }

  ngOnDestroy() {
    if (this.iframe) {
      this.iframe.removeEventListener('load', this.handleIframeLoad);
      this.iframe = null;
    }
    this.scoreCardFrame.nativeElement.innerHTML = '';
    document.body.classList.remove('scroll-lock');
  }
}
