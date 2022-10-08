import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  basket$: Observable<IBasket>;
  currentUser$: Observable<IUser>;
  currentRole$: Observable<string>;
  public innerWidth: number;

  constructor(private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUser$;
    this.currentRole$ = this.accountService.currentRole$;
    this.innerWidth = window.innerWidth;
  }

  logout() {
    this.accountService.logout();
  }

}
