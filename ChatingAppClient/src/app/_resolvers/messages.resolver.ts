import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()

export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';
    // tslint:disable-next-line: max-line-length
    constructor(private userService: UserService, private authService: AuthenticationService, private router: Router, private alertify: AlertifyServiceService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
       // tslint:disable-next-line: max-line-length
       return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving messages');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
