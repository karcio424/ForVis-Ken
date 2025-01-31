import {Injectable, OnInit} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map'
import { User } from '../_models';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  url_prefix: string = '/api/auth/';
  authenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated = this.authenticated$.asObservable();

  constructor(
    private http: Http
  ){}

  authOptions(options?: Object, headers?: Headers){
    if (!options) options = {};
    if (!headers) headers = new Headers();

    let token = localStorage.getItem('token');
    if (token) {
      headers.append('Authorization', 'JWT ' + token);
      options['headers'] = headers;
    }
    return new RequestOptions(options);
  }
tokenAuth(user: User, captchaResponse: string){
    return this.http.post(this.url_prefix+'api-token-auth/',
      {"username": user.name, "password": user.password, "recaptcha": captchaResponse})
      .map((response: Response) =>
      {
        let data = response.json();
        localStorage.setItem('token', data['token']);
        this.authenticated$.next(true);
        return data;
      });
  }

  tokenRefresh(){
    return this.http.post(this.url_prefix+'api-token-refresh/',
      {token:localStorage.getItem('token')})
      .map((response: Response) =>
      {
        let data = response.json();
        localStorage.setItem('token', data['token']);
        this.authenticated$.next(true);

        return data;
      });
  }

  tokenVerify():Observable<boolean> {
    return this.http.post(this.url_prefix+'api-token-verify/',
      {token:localStorage.getItem('token')})
      .map((response) => {
        this.authenticated$.next(true);
        return response.ok;
      }
      );
  }

  logout(){
    this.authenticated$.next(false);
    localStorage.clear();
  }

  getAuthTokenString(){
    return 'JWT ' + localStorage.getItem('token');
  }
}
