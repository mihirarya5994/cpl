import { Component, OnInit } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import {
  AppService,
  ProfileService,
  TrackerService,
  AnalyticsService
} from "src/app/core";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  showAvatarSelectionPopup = false;
  showEditPopup = false;
  editSetting = null;
  inpNickName = "";
  serverProfile: any = {};

  constructor(
    private appService: AppService,
    private profileService: ProfileService,
    private trackerService: TrackerService,
    private translate: TranslateService,
    private analyticsService: AnalyticsService
  ) {}

  settings = [
    {
      translationKey: "TYPE_YOUR_NICK_NAME",
      label: "",
      value: "",
      type: "nickName",
      editForm: {
        header: "",

        title: "",
        desc: "",
        info: "",
        placeholder: ""
      }
    },
    {
      translationKey: "WHERE_ARE_YOU_FROM",
      label: "",
      value: "",
      type: "state",
      editForm: {
        header: "",
        title: "",
        desc: "",
        info: "",
        placeholder: "",
        options: this.appService.getContentConfig().states
      }
    },
    {
      translationKey: "WHAT_IS_YOUR_GENDER",
      label: "",
      value: "",
      type: "gender",
      editForm: {
        header: "",
        title: "",
        desc: "",
        info: "",
        placeholder: "",
        options: this.appService.getContentConfig().genders
      }
    },
    {
      translationKey: "WHAT_IS_YOUR_AGE",
      label: "",
      value: "",
      type: "ageGroup",
      editForm: {
        header: "",
        title: "",
        desc: "",
        info: "",
        placeholder: "",
        options: this.appService.getContentConfig().ageGroups
      }
    }
  ];
  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Profile Page");
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile;
      for (let i = 1; i < 4; i++) {
        this.settings[i].editForm.options.forEach(n => {
          this.translate.get(n.translationKey).subscribe(res => {
            n.title = res;
          });
        });
      }

      this.settings.forEach(n => {
        this.translate.get(n.translationKey).subscribe((res: any) => {
          n.label = res.label;

          n.editForm.header = res.editForm.header;
          n.editForm.title = res.editForm.title;
          n.editForm.desc = res.editForm.desc;
          n.editForm.info = res.editForm.info;
          n.editForm.placeholder = res.editForm.placeholder;
        });
      });

      this.settings[0].value = this.profile.nickName;
      this.settings[1].value = this.profile.state;
      this.settings[2].value = this.profile.gender;
      this.settings[3].value = this.profile.ageGroup;
      this.setProfileImg();
    });
  }

  toggleAvatarSelectionPopup() {
    this.showAvatarSelectionPopup = !this.showAvatarSelectionPopup;
    this.setProfileImg();
  }

  toggleEditPopup(setting?) {
    if (this.showEditPopup === false) {
      this.inpNickName = setting.value;
    }
    this.editSetting = setting;
    this.showEditPopup = !this.showEditPopup;
  }

  updateProfile(setting, option) {
    const changes = {};
    if (option) {
      option.selected = true;
      changes[setting.type] = option.value;
      setting.value = option.value;
    } else {
      changes[setting.type] = setting.value;
      changes[setting.type] = this.inpNickName;
    }
    const tracekey = { ...this.profile, ...changes };
    this.analyticsService.clickTrack("Save", "SS | Profile Page", {
      ageGroup: tracekey.ageGroup,
      city: tracekey.state,
      gender: tracekey.gender
    });
    this.profileService.updateProfile(changes).subscribe(() => {
      this.toggleEditPopup();
      if (setting.type === "nickName") {
        this.settings[0].value = changes[setting.type];
      }
    });
    this.profileService.getServerProfile().subscribe(res => {
      if (res) {
        if (res.profilePending) {
          if (
            this.settings.filter(s => {
              return !(
                s.editForm &&
                s.label &&
                s.translationKey &&
                s.type &&
                s.value
              );
            }).length === 0
          ) {
            this.profileService.profileCompleted();
          }
        }
      }
    });
  }

  setProfileImg() {
    const profile = this.profileService.getProfileSync();
    if (profile.avatar) {
      this.profile.avatarImg = this.appService
        .getContentConfig()
        .avatars.filter(a => a.id === profile.avatar)[0].imgUrl;
    }
  }
}
