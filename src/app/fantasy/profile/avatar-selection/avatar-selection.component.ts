import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AppService, ProfileService } from 'src/app/core';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss']
})
export class AvatarSelectionComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  avatars = [];
  profile;

  constructor(private appService: AppService, private profileService: ProfileService) {}

  ngOnInit() {
    this.profile = this.profileService.getProfileSync();
    this.avatars = this.appService.getContentConfig().avatars;
  }

  selectAvatar(avatar) {
    this.profileService.updateProfile({ avatar: avatar.id }).subscribe(() => this.closePopup());
    this.profileService.updateServerProfile({ avatar: avatar.id });
  }

  closePopup() {
    this.close.emit();
  }
}
