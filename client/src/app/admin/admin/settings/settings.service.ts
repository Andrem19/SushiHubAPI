import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getConfirmEmail() {
    return this.http.get(this.baseUrl + 'Admin/emailcomfirmletter');
  }
  changeConfirmEmail(email: string) {
    return this.http.post(this.baseUrl + 'Admin/emailcomfirmletter?email=' + email, null);
  }
  saveAllUsers(email: string) {
    return this.http.get(this.baseUrl + 'Admin/saveUsers?email=' + email);
  }
}
