import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/orders/auth.service';
import { AccountService } from '../account.service';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];
  MyReferer: string = '';
  ref: string;
  public innerWidth: any;


  constructor(private authService: SocialAuthService, private aService: AuthService, private route: ActivatedRoute, private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.createRegisterForm();
    this.ref = localStorage.getItem('ref')
    if (this.ref) {
      this.MyReferer = this.ref;
    }
    this.route.queryParams
      .subscribe(params => {
        if (params.ref) {
          this.MyReferer = params.ref;
        localStorage.setItem('ref', params.ref);
        this.ref = params.ref;
        }
      }
    );
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      email: [null, 
        [Validators.required, Validators
        .pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
        [this.validateEmailNotTaken()]
      ],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      const body = {AccessToken: user.authToken, ReferalCode: this.MyReferer}
      this.accountService.signInWithFacebook(body).subscribe(() => {
        this.router.navigateByUrl('/shop');
        setTimeout(() => this.aService.authMe(this.accountService.getEmail()), 2000);
      }, error => {
        console.log(error);
      });
      localStorage.removeItem('fblst_1038625583498515');
    });
  }
  onSubmit() {
    if (this.ref) {
      localStorage.removeItem('ref');
    }
    this.accountService.register(this.registerForm.value, this.MyReferer).subscribe(response => {
      this.router.navigateByUrl('/account/register_success');
    }, error => {
      console.log(error);
      this.errors = error.errors;
    })
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map(res => {
               return res ? {emailExists: true} : null;
            })
          );
        })
      )
    }
  }

}