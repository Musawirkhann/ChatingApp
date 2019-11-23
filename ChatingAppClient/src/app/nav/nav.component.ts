import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authenticationservice: AuthenticationService, private alertify: AlertifyServiceService, private router: Router) { }

  ngOnInit() {
    this.authenticationservice.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  login() {
    this.authenticationservice.login(this.model).subscribe(next => {
      this.alertify.success('Logged in Succesfuly');
    }, error => {
      this.alertify.error('Failed to Login');
    }, () => {
      this.router.navigate(['/members']);
    });
  }
  loggedIn() {
    return this.authenticationservice.loggedIn();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authenticationservice.decodedToken = null;
    this.authenticationservice.currnetUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }

}
