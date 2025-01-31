import { Component, OnInit } from '@angular/core';
import {User} from '../_models';
import {NgModel} from '@angular/forms';
import {AlertService, AuthService, UserService} from '../_services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  user: User = new User;
  oldUser: User = new User;
  oldPassword: string = '';
  captchaValid: boolean = false;
  captchaResponse: string = undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit() {
    this.userService.getUser().subscribe(
      (response) => {
        this.oldUser.name = response.username;
        this.oldUser.email = response.email;
        this.oldUser.firstname = response.first_name;
        this.oldUser.lastname = response.last_name;
      }
    );
  }

  submit() {
    if (!this.captchaValid) {
      return;
    }
    let oldUserVerify = new User()
    oldUserVerify.name = this.oldUser.name;
    oldUserVerify.password = this.oldPassword;

    this.authService.tokenAuth(oldUserVerify, this.captchaResponse).subscribe(
      data => {
        this.userService.editUser(this.user).subscribe(
          () => {
            this.router.navigate(['sat']);
          },
          error => this.alertService.error(error)
        )
      }
      ,
      error => this.alertService.error(error)
    );
  }

  captchaResolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.captchaValid = !!captchaResponse;
  }
}
