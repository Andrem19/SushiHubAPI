import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { IAddress } from '../shared/models/address';
import { IDiscounts } from '../shared/models/discount';
import { IReferal } from '../shared/models/referal';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  private currentRoleSource = new BehaviorSubject<string>(null);
  currentRole$ = this.currentRoleSource.asObservable();
  private currentDiscountsSource = new BehaviorSubject<IDiscounts>(null);
  currentDiscounts$ = this.currentDiscountsSource.asObservable();
  private currentRefCodeSource = new BehaviorSubject<string>(null);
  currentRefCode$ = this.currentRefCodeSource.asObservable();
  private currentPointSource = new BehaviorSubject<string>(null);
  currentPoint$ = this.currentPointSource.asObservable();
  private currentEmailSource = new BehaviorSubject<string>(null);
  currentEmail$ = this.currentEmailSource.asObservable();

  constructor(public toastr: ToastrService, private http: HttpClient, private router: Router) { }

  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          const RefDiscount = user.refDiscount;
          const AcumDiscount = user.acumDiscount;
          this.currentDiscountsSource.next({RefDiscount, AcumDiscount});
          this.currentRefCodeSource.next(user.myRefCode);
          this.currentPointSource.next(user.point);
          this.currentEmailSource.next(user.email);
          if (user.roles.find(x => x === "Delivery")) {
            this.currentRoleSource.next('Delivery')
          }
          if (user.roles.find(x => x === "Moderator")) {
            this.currentRoleSource.next('Moderator')
          } 
          if (user.roles.find(x => x === "Admin")) {
            this.currentRoleSource.next('Admin')
          } 
          const email = localStorage.getItem('email');
          if (email) localStorage.removeItem('email');
        }
      })
    )
  }
  signInWithFacebook(values: any) {
    return this.http.post(this.baseUrl + 'account/loginfb', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          const RefDiscount = user.refDiscount;
          const AcumDiscount = user.acumDiscount;
          this.currentDiscountsSource.next({RefDiscount, AcumDiscount});
          this.currentRefCodeSource.next(user.myRefCode);
          this.currentPointSource.next(user.point);
          this.currentEmailSource.next(user.email);
          if (user.roles.find(x => x === "Delivery")) {
            this.currentRoleSource.next('Delivery')
          }
          if (user.roles.find(x => x === "Moderator")) {
            this.currentRoleSource.next('Moderator')
          } 
        }
      })
    )
  }
  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  register(values: any, ref?: string) {
    let referer = '';
    if (ref) {
    referer = `?referal=${ref}`
    }

    if (values.password !== values.confirmPassword) {
      this.toastr.show("Passwords don't match");
      return
    }
    const content = {
      displayName: values.email,
      email: values.email,
      password: values.password
    }
    localStorage.setItem('email', values.email)
    return this.http.post(this.baseUrl + 'account/register' + referer, content).pipe(
      map((user: IUser) => {
        if (user) {
          // this.currentUserSource.next(user);
          console.log("register_conf")
        }
      })
    )
  }

  updateUserAddress(address: IAddress) {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address, {headers});
  }
  sendConfLink(email: string) {
    return this.http.get(this.baseUrl + 'account/sendconflinkagain?email='+ email).subscribe((res) => {
      console.log('send')
    });
  }
  getAllMyReferals() {
    return this.http.get(this.baseUrl + 'Discount/getreferals').pipe(
      map((referals: IReferal[]) => {
        return referals;
      }))
  }
  getUserAddress() {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IAddress>(this.baseUrl + 'account/address', {headers});
  }
  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.currentRoleSource.next(null);
    this.currentDiscountsSource.next(null);
    this.router.navigateByUrl('/')
  }
  getRefCode() {
    return this.currentRefCodeSource.value;
  }
  getEmail() {
    return this.currentEmailSource.value;
  }
  getModerPoint() {
    return this.currentPointSource.value;
  }
  getRole() {
    return this.currentRoleSource.value;
  }
  accesWorker(): string {
    return this.currentRoleSource.value;
  }
  getCurrentDiscounts() {
    return this.currentDiscountsSource.value;
  }
  loadCurrentUser(token: string) {
    if (token == null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account/currentuser', {headers}).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          const RefDiscount = user.refDiscount;
          const AcumDiscount = user.acumDiscount;
          this.currentDiscountsSource.next({RefDiscount, AcumDiscount});
          this.currentRefCodeSource.next(user.myRefCode);
          this.currentPointSource.next(user.point);
          this.currentEmailSource.next(user.email);
          if (user.roles.find(x => x === "Delivery")) {
            this.currentRoleSource.next('Delivery')
          }
          if (user.roles.find(x => x === "Moderator")) {
            this.currentRoleSource.next('Moderator')
          } 
          if (user.roles.find(x => x === "Admin")) {
            this.currentRoleSource.next('Admin')
          } 
        }
      })
    )
  }

  getDecodedAccessToken(token: string): any {
    try {
      const tokenDecoded: any = jwt_decode(token);
      console.log(tokenDecoded)
      return tokenDecoded;
    } catch(Error) {
      return null;
    }
  }
}
