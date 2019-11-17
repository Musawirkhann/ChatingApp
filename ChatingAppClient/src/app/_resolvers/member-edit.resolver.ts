import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()

export class MemberEditResolver implements Resolve<User> {
    // tslint:disable-next-line: max-line-length
    constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, private alertify: AlertifyServiceService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
       return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving your data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}
