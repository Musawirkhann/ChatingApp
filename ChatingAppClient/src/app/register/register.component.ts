import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private authentication: AuthenticationService, private alertify: AlertifyServiceService) { }

  ngOnInit() {
  }
  register() {
      this.authentication.register(this.model).subscribe(() => {
          this.alertify.success('Registration Successful');
      }, error => {
        this.alertify.error('Registration Failed');
      });
  }
  cancel() {
    this.cancelRegister.emit(false);
    
  }

}
