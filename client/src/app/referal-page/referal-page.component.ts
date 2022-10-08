import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';
import { IReferal } from '../shared/models/referal';

@Component({
  selector: 'app-referal-page',
  templateUrl: './referal-page.component.html',
  styleUrls: ['./referal-page.component.scss']
})
export class ReferalPageComponent implements OnInit {
CodeForm: FormGroup;
myReferals: Observable<IReferal[]>;
Link: string = `${environment.fullUrlClient}account/register?ref=`;
Code$: Observable<string>
Code: string;

  constructor(private toastr: ToastrService, private clipboardApi: ClipboardService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.Code$ = this.accountService.currentRefCode$
    this.Code = this.accountService.getRefCode();
    this.myReferals = this.accountService.getAllMyReferals();
  }
  copyLink(link) {
    this.clipboardApi.copyFromContent(link + this.accountService.getRefCode())
    this.toastr.success('Link has been copied');
  }
  copyCode(code) {
    this.clipboardApi.copyFromContent(code);
    this.toastr.success('Code has been copied');
  }
  getCode() {
    return this.accountService.getRefCode();
  }
}
