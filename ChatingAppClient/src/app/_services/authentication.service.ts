import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl  = environment.ApiUrl + 'authentication/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currnetUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/images/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

 constructor(private http: HttpClient) { }
 changeMemberPhoto(photoUrl: string) {
  this.photoUrl.next(photoUrl);
 }
 login(model: any) {
   return this.http.post(this.baseUrl + 'login', model)
   .pipe(
      map((responce: any) => {
            const user = responce;
            if (user) {
              localStorage.setItem('token', user.token);
              localStorage.setItem('user', JSON.stringify(user.user));
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
              this.currnetUser = user.user;
              this.changeMemberPhoto(this.currnetUser.photoUrl);
            }
        })
    );
 }

 register(model: any) {
   return this.http.post(this.baseUrl + 'register', model);
 }

 loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
 }

}
