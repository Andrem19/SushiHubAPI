import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/orders/auth.service';
import { AccountService } from '../account.service';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  public innerWidth: any;

  constructor(private authService: SocialAuthService, private aService: AuthService, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop';
    this.createLoginForm();
    this.innerWidth = window.innerWidth;
  }
  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators
        .pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl('', Validators.required),
    })
  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      const body = {AccessToken: user.authToken}
      this.accountService.signInWithFacebook(body).subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
        setTimeout(() => this.aService.authMe(this.accountService.getEmail()), 2000);
      }, error => {
        console.log(error);
      });
      localStorage.removeItem('fblst_1038625583498515');
    });
  }
  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
      setTimeout(() => this.aService.authMe(this.accountService.getEmail()), 2000);
    }, error => {
      console.log(error);
    })
  }
}
