import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisMenuService } from '../_services';
import { File } from '../_models';

@Component({
  selector: 'app-vis-menu',
  templateUrl: './vis-menu.component.html',
  styleUrls: ['./vis-menu.component.css']
})
export class VisMenuComponent implements OnInit {
  showMenu: Boolean;
  showConfirmation: Boolean;
  showBadRequest: Boolean;
  file: File;
  kind: string;
  taskMessage: any;

  constructor(
        private router: Router,
        private visMenuService: VisMenuService
  ) { }

  ngOnInit() {
    this.visMenuService.getOverlayStatus().subscribe(
      data => {
      this.showMenu = data.show;
      this.file = data.file;
      this.kind = data.kind;
      this.showConfirmation = data.confirmation;
      this.showBadRequest = data.badRequest;
    });
  }

  visualizeFile(vistype){
    let type: string;

    if(vistype != 'raw'){
      type = this.kind + "_" + vistype;
    }
    else{
      type = vistype;
    }

    this.visMenuService.scheduleTask(this.file.id, type).subscribe(
      (data) => {
        this.taskMessage = data.json().message;
        if(data.json().status === "ok"){
          this.confirm();
        }
        else{
          this.badRequest();
        }
      }
    )
  }

  confirm(){
    this.visMenuService.openConfirmation(this.file, this.kind);
  }

  badRequest() {
    this.visMenuService.openBadRequest(this.file, this.kind);
  }

  close(){
    this.visMenuService.close();
  }
}
