import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertifyServiceService } from '../_services/alertifyService.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  // tslint:disable-next-line: max-line-length
  constructor(private authentication: AuthenticationService, private alertify: AlertifyServiceService, private fb: FormBuilder, private route: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    },
    this.createRegiterForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4),
    //     Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator);
  }
  createRegiterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4),
      Validators.maxLength(8)] ],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }
  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authentication.register(this.user).subscribe(() => {
        this.alertify.success('Registration Successful');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authentication.login(this.user).subscribe(() => {
          this.route.navigate(['/members']);
        });
      });
    }
      // this.authentication.register(this.model).subscribe(() => {
      //     this.alertify.success('Registration Successful');
      // }, error => {
      //   this.alertify.error('Registration Failed');
      // });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }

}
