import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyServiceService } from '../_services/alertifyService.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer: 'Unread';
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthenticationService, private userService: UserService, private route: ActivatedRoute, private alertify: AlertifyServiceService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }
  loadMessages() {
    // tslint:disable-next-line: max-line-length
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer).subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Message has been deleted');
      }, error => {
        this.alertify.error(error);
      });
    });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
