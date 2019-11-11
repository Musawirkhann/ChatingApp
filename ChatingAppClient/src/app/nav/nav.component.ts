import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public authenticationservice: AuthenticationService, private alertify: AlertifyServiceService) { }

  ngOnInit() {
  }
  login() {
    this.authenticationservice.login(this.model).subscribe(next => {
      this.alertify.success('Logged in Succesfuly');
    }, error => {
      this.alertify.error('Failed to Login');
    });
  }
  loggedIn() {
    return this.authenticationservice.loggedIn();
  }
  logout() {
    localStorage.removeItem('token');
    this.alertify.message('logged out');
  }

}
