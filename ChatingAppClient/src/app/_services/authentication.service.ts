import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl  = 'http://localhost:5000/api/authentication/';

 constructor(private http: HttpClient) { }
 login(model: any) {
   return this.http.post(this.baseUrl + 'login', model)
   .pipe(
      map((responce: any) => {
            const user = responce;
            if (user) {
              localStorage.setItem('token', user.token);
            }
        })
    );
 }

 register(model: any) {
   return this.http.post(this.baseUrl + 'register', model);
 }

}
