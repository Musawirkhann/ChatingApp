import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyServiceService } from 'src/app/_services/alertifyService.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', {static: false}) editForm: NgForm;
  user: User;
  @HostListener('window: beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private alertify: AlertifyServiceService, private        userService: UserService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
  }
  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('User Update Successfuly..');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });
  }

}
