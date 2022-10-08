import { Component, OnInit } from '@angular/core';
import { ISettings } from '../../Interfaces/emailLetterConfirm';
import { IUserSave } from '../../Interfaces/users';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
settings: ISettings;
newConfirmEmail: string;
trigerSettings: boolean = false;
emailToSaveUsers: string;
  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.setSettings()
  }
  

  setSettings() {
    this.settingsService.getConfirmEmail().subscribe((settings: ISettings) => {
      this.settings = settings;
      this.trigerSettings = true;
    })
  }
  ChangeConfirmEmail() {
    this.settingsService.changeConfirmEmail(this.newConfirmEmail).subscribe((settings: ISettings) => {
      this.settings = settings;
    })
  }
  saveUsers() {
    this.settingsService.saveAllUsers(this.emailToSaveUsers).subscribe((resp: IUserSave) => {
      var myWindow = window.open("", "Users", "width=500,height=500");
      var string = JSON.stringify(resp);
      myWindow.document.write(string);
    })
  }
}
