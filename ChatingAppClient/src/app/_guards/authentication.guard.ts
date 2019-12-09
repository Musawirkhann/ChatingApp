import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

   constructor(private authentication: AuthenticationService, private router: Router, private alertify: AlertifyServiceService) {}
   canActivate(next: ActivatedRouteSnapshot): boolean {
     const roles = next.firstChild.data.roles as Array<string>;
     if (roles) {
       const match = this.authentication.roleMatch(roles);
       if (match) {
          return true;
        } else {
         this.router.navigate(['members']);
         this.alertify.error('You are not Athorize to access this area');
        }
      }
     if (this.authentication.loggedIn()) {
       return true;
      } else {
       this.alertify.error('Oooops Something Went Wrong!!....');
       this.router.navigate(['/home']);
       return false;
     }

   }
}
