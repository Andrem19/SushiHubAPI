import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { SignalRService } from './signal-r.service';
import {Howl, Howler} from 'howler';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private signalrService: SignalRService, private router: Router, private accountService: AccountService) {}

async authMe(email: string) {
  await this.signalrService.hubConnection.send("authMe", email);
}
public sendMsgLis(): void {
  this.signalrService.hubConnection.on("sendMsgResponse", (msg: string) => {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/ordersm']);
  }); 
  const sound = new Howl({
    src: ['/assets/sounds/coins.mp3']
  });
    sound.play();
    this.signalrService.toastr.success(msg);
  });
}

public orderIsReady(): void {
  this.signalrService.hubConnection.on("orderIsReady", (orderId: string) => {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/orders/'+orderId]);
      const sound = new Howl({
        src: ['/assets/sounds/msg.mp3']
      });
      sound.play();
      this.signalrService.hubConnection.off("orderIsReady");
  }); 
    
    this.signalrService.toastr.success("Your Order Is Ready To Collect");
  });
}

authMeListenerSuccess() {
  this.signalrService.hubConnection.on("authMeResponseSuccess", (message: string) => {
      console.log(message);
  });
}

authMeListenerFail() {
  this.signalrService.hubConnection.on("authMeResponseFail", () => {
      this.signalrService.toastr.error("Wrong credentials!");
  });
}    

}

