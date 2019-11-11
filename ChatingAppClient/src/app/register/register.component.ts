import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private authentication: AuthenticationService) { }

  ngOnInit() {
  }
  register() {
      this.authentication.register(this.model).subscribe(() => {
          alert('Registration Successful');
      }, error => {
        alert(error);
      });
  }
  cancel() {
    this.cancelRegister.emit(false);
    console.log('Cancelled');
  }

}
