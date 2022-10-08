import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SocialAuthServiceConfig, SocialAuthService} from 'angularx-social-login';
import { FacebookLoginProvider,} from 'angularx-social-login';
import { EmailConfirmComponent } from './email-confirm/email-confirm.component';
import { EmailConfirmSuccessComponent } from './email-confirm-success/email-confirm-success.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    EmailConfirmComponent,
    EmailConfirmSuccessComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    FormsModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1038625583498515'),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    SocialAuthService,
  ]
})
export class AccountModule { }
