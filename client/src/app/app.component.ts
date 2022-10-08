import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { AuthService } from './orders/auth.service';
import { SignalRService } from './orders/signal-r.service';
import { IBasket } from './shared/models/basket';
import { IUser } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'YoHei Rolls';
  

  constructor(public authService: AuthService, private signalrService: SignalRService, private basketService: BasketService, private accountService: AccountService) {}

  async ngOnInit() {
    this.signalrService.startConnection();

    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      await this.basketService.getBasket();
    }

    this.loadCurrentUser();

    this.authService.authMeListenerSuccess();
    this.authService.authMeListenerFail();

  }

  ngOnDestroy() {
    this.signalrService.hubConnection.off("askServerResponse");
    this.signalrService.hubConnection.off("authMeResponseSuccess");
    this.signalrService.hubConnection.off("authMeResponseFail");
    this.signalrService.hubConnection.off("sendMsgResponse");
  }
  loadAddress() {
    this.accountService.getUserAddress().subscribe(() => {
    }, error => {
      console.log(error)
    });
  }

  async loadCurrentUser() {
    const token = localStorage.getItem('token');
      await this.accountService.loadCurrentUser(token).subscribe(() =>{
        let role = this.accountService.getRole();
        console.log(role)
        if (role === "Admin" || role === "Moderator") {
          setTimeout(() => this.authService.authMe(this.accountService.getEmail()), 2000);
          this.authService.sendMsgLis();
        }
      }, error => {
        console.log(error)
      })
  }
}
