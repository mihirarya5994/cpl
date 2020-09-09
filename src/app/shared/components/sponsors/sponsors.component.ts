import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';

import * as Flickity from 'flickity';

import { AppService } from './../../../core/services/app.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements AfterViewInit, OnInit {
  @ViewChild('slider', { static: true }) sliderEle: ElementRef;
  sponsors: any[] = [];

  private slider;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.sponsors = this.appService.getContentConfig().sponsors;
  }

  ngAfterViewInit() {
    this.initSlider();
  }

  initSlider() {
    this.slider = new Flickity(this.sliderEle.nativeElement, {
      prevNextButtons: false,
      autoPlay: 2000,
      pageDots: false,
      contain: true,
      cellAlign: 0,
      wrapAround: true,
      pauseAutoPlayOnHover: false
      // on: {
      //   staticClick: () => {
      //     this.slider.playPlayer();
      //   },
      //   dragEnd: () => {
      //     this.slider.playPlayer();
      //   }
      // }
    });
  }
}
