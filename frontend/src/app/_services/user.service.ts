import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {User} from '../_models';
import {AuthService} from './auth.service';

@Injectable()
export class UserService {
  user_url: string = '/api/profile/';

  constructor(
    private http: Http,
    private authService: AuthService
  ) { }

  getUser() {
    return this.http.get(this.user_url+'user', this.authService.authOptions())
      .map((response: Response) =>
    {
      let data = response.json();
      return data;
    })
  }

  editUser(user: User) {
      return this.http.put(this.user_url+'edit', user, this.authService.authOptions());
  }
}
