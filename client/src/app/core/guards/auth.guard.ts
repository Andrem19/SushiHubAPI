import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild{
  constructor(private accountService: AccountService, private router: Router) {}
  
   
  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): Observable<boolean> {
      return this.accountService.currentRole$.pipe(
        map(auth => {
          if (auth === route.data.role || auth === 'Admin') {
            return true;
          } else {
            this.router.navigate(['/'])
          }}
        ))
      }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        if (auth) {
          console.log(route.data.role)
          return true;
        }
        this.router.navigate(['account/login'], {queryParams: {returnUrl: state.url}})
      })
    )
  }
}
