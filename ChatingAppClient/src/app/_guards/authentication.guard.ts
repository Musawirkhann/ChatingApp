import { Injectable } from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

   constructor(private authentication: AuthenticationService, private router: Router, private alertify: AlertifyServiceService) {}
   canActivate(): boolean {
     if (this.authentication.loggedIn()) {
       return true;
      } else {
       this.alertify.error('Oooops Something Went Wrong!!....');
       this.router.navigate(['/home']);
       return false;
     }

   }
}
