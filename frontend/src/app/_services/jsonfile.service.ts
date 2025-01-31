import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {AuthService} from './auth.service';
import {Jsonfile} from "../_models";

@Injectable()
export class JsonfileService {

  url_visualizations = '/api/profile/visualizations/';
  url_visualization = '/api/profile/visualization/'
  url_community = '/api/profile/visualization/community/'

  constructor(
    private http: Http,
    private authService: AuthService
  ) {}

  visualizeCommunity(vis: Jsonfile){
    // this.http.get(this.url_visualizations, this.authService.authOptions()).subscribe(x=> console.log(x));
    this.http.get(this.url_community+vis.id+'/', this.authService.authOptions()).subscribe(x=> console.log(x));
  }

  getJsonFileList(){
    return this.http.get(this.url_visualizations, this.authService.authOptions())
      .map((res: Response) => res.json());
  }

  getJsonFile(id: number, format: string, selectedVariables = []) {
    return this.http.get(this.url_visualization + id + '/' + format + '/',
      this.authService.authOptions().merge({params: {selectedVariables: selectedVariables}}))
      .map((res: Response) => res.json());
  }

  deleteJsonFile(id: number) {
    return this.http.delete(this.url_visualization + id + '/del/', this.authService.authOptions());
  }

}
