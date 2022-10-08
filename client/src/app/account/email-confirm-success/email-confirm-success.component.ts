import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-confirm-success',
  templateUrl: './email-confirm-success.component.html',
  styleUrls: ['./email-confirm-success.component.scss']
})
export class EmailConfirmSuccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    localStorage.removeItem('email');
  }

}
