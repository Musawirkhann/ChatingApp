import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;

  // tslint:disable-next-line: max-line-length
  constructor(private viewContaineRef: ViewContainerRef, private templateRef: TemplateRef<any>, private authService: AuthenticationService) { }

  ngOnInit() {
    const userRoles = this.authService.decodedToken.role as Array<string>;
    if (!userRoles) {
      this.viewContaineRef.clear();
    }
    if (this.authService.roleMatch(this.appHasRole)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContaineRef.createEmbeddedView(this.templateRef);
      } else {
        this.isVisible = false;
        this.viewContaineRef.clear();
      }
    }
  }

}
