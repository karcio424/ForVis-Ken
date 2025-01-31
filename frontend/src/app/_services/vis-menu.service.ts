import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { File } from '../_models/file';
import {Http} from '@angular/http';

@Injectable()
export class VisMenuService {
  private overlayMenu = new Subject<any>();

  taskUrl: string = '/api/profile/task/';

  constructor(
    private http: Http,
  ){}

  getOverlayStatus(): Observable<any> {
        return this.overlayMenu.asObservable();
  }

  scheduleTask(fileId: number, visType: string){
    const url = this.taskUrl + visType + '/' + fileId + '/';
    return this.http.get(url);
  }

  open(file: File, kind: string){
    this.overlayMenu.next({
      show: true, confirmation: false, badRequest: false, file: file, kind: kind
    });
  }

  openConfirmation(file: File, kind: string){
    this.overlayMenu.next({
      show: false, confirmation: true, badRequest: false, file: file, kind: kind
    });
  }

  openBadRequest(file: File, kind: string) {
    this.overlayMenu.next({
      show: false, confirmation: false, badRequest: true, file: file, kind: kind
    });
  }

  close(){
    this.overlayMenu.next({show: false, confirmation: false});
  }
}
