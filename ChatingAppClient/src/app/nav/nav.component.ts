import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authenticationservice: AuthenticationService) { }

  ngOnInit() {
  }
  login() {
    this.authenticationservice.login(this.model).subscribe(next => {
      alert('Logged in Succesfuly');
    }, error => {
      console.log(error);
    });
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }
  logout() {
    localStorage.removeItem('token');
    console.log('logged out');
  }

}
