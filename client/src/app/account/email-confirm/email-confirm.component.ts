import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.scss']
})
export class EmailConfirmComponent implements OnInit {

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }
sendLinkAgain() {
  const email = localStorage.getItem('email');
  this.accountService.sendConfLink(email);
}
}
