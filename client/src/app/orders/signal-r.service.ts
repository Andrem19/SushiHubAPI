import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as signalR from '@aspnet/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  hubConnection: signalR.HubConnection;
  personName: string;
  ssSubj = new Subject<any>();
  toasterUrl = environment.toasterApi;

  constructor(public toastr: ToastrService, public router: Router) { }
  
  ssObs(): Observable<any> {
      return this.ssSubj.asObservable();
  }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.toasterUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .build();

    this.hubConnection
    .start()
    .then(() => {
        this.ssSubj.next({type: "HubConnStarted"});
    })
    .catch(err => console.log('Error while starting connection: ' + err))
}
}
