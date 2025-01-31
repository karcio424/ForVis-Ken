import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {RegisterService} from "../_services";
import {AlertService} from "../_services";

import {User} from '../_models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = new User;
  captchaValid: boolean = false;
  captchaResponse: string = undefined;

  constructor(
    private registerService: RegisterService,
    private alertService: AlertService,
    private router: Router) {
  }

  register() {
    if (!this.captchaValid) {
      return;
    }
    this.registerService.register(this.user, this.captchaResponse).subscribe(
        data => this.router.navigate(['login']),
        error => this.alertService.error(error)
    )
  }

  captchaResolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
}
