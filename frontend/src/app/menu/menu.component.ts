import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services";
import {Router} from "@angular/router";
import {Observable} from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuCollapsed: boolean = true;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isAuthenticated;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['logout']);
  }
}
