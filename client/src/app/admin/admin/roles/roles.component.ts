import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/models/user';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  formEmail: FormGroup;
  user$: Observable<IUser>;
  point: string;
  roleToAdd: string;
  roleToRemove: string;
  telegramChatId: string;
  newPassword: string;

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit(): void {
    this.createChangeForm()
    this.user$ = this.adminService.user$;
  }
  changePassword() {
    this.adminService.changePassword(this.formEmail.get('Email').value, this.newPassword);
  }
  deleteUser() {
    this.adminService.dleteUserByEmail(this.formEmail.get('Email').value);
  }
  addRole() {
    this.adminService.addRole(this.formEmail.get('Email').value, this.roleToAdd);
    let currentUser: IUser = this.adminService.getCurrentUserValue();
    currentUser.roles.push(this.roleToAdd);
  }
  removeRole() {
    this.adminService.removeRole(this.formEmail.get('Email').value, this.roleToRemove);
    let currentUser: IUser = this.adminService.getCurrentUserValue();
    currentUser.roles = currentUser.roles.filter(obj => obj !== this.roleToRemove);
  }
  addPoint() {
    this.adminService.addPoint(this.formEmail.get('Email').value, this.point);
    let currentUser: IUser = this.adminService.getCurrentUserValue();
    currentUser.point = this.point;
  }
  addTChatToken() {
    this.adminService.addTelegramChatId(this.formEmail.get('Email').value, this.telegramChatId);
    let currentUser: IUser = this.adminService.getCurrentUserValue();
    currentUser.telegramBotChatId = this.telegramChatId;
  }

  onSubmit() {
    this.adminService.getUserFromEmail(this.formEmail.get('Email').value)
  }
  async createChangeForm() {
    this.formEmail = this.fb.group({
      Email: [''],
    })
  }
}
