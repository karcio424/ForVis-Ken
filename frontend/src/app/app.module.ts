import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {FileUploadModule} from 'ng2-file-upload';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {MenuComponent} from './menu/menu.component';
import {AlertComponent} from './alert/alert.component';
import {SatComponent} from './sat/sat.component';
import {
  AlertService,
  AuthService,
  FileService,
  JsonfileService,
  RegisterService,
  UserService,
  VisMenuService
} from './_services';
import {AuthGuard} from './_guards/auth.guard';
import {VisMenuComponent} from './vis-menu/vis-menu.component';
import {VisualizationRawComponent} from './visualization-raw/visualization-raw.component';
import {VisualizationVisFactorComponent} from './visualization-vis_factor/visualization-vis_factor.component';
import {
  VisualizationVisInteractionComponent
} from './visualization-vis_interaction/visualization-vis_interaction.component';
import {
  VisualizationVisResolutionComponent
} from './visualization-vis_resolution/visualization-vis_resolution.component';
import {VisualizationVisMatrixComponent} from './visualization-vis_matrix/visualization-vis_matrix.component';
import {VisualizationVisTreeComponent} from './visualization-vis_tree/visualization-vis_tree.component'
import {VisualizationVisClusterComponent} from './visualization-vis_cluster/visualization-vis_cluster.component';
import {MaxsatComponent} from './maxsat/maxsat.component';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {RecaptchaModule} from "ng-recaptcha";
import {LogoutComponent} from './logout/logout.component';
import {VisualizationsComponent} from './visualizations/visualizations.component';
import {ModalProgressComponent} from './modal-progress/modal-progress.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {
  VisualizationVisDistributionComponent
} from './visualization-vis-distribution/visualization-vis-distribution.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModalBadFileComponent} from './modal-bad-file/modal-bad-file.component';
import {DocsComponent} from './docs/docs.component';
import {EditAccountComponent} from './edit-account/edit-account.component';
import {VisualizationVisCommunityComponent} from './visualization-vis-community/visualization-vis-community.component';
import {VisualizationVisDirectedComponent} from './visualization-vis_directed/visualization-vis_directed.component';
import {VisualizationVis2ClauseComponent} from './visualization-vis_2clause/visualization-vis_2clause.component';
import {VisualizationVisDpllComponent} from './visualization-vis_dpll/visualization-vis_dpll.component';
import {VisualizationVisHeatmapComponent} from './visualization-vis-heatmap/visualization-vis-heatmap.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'visualization-vis_resolution', component: VisualizationVisResolutionComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis-community', component: VisualizationVisCommunityComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_factor', component: VisualizationVisFactorComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_interaction', component: VisualizationVisInteractionComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_matrix', component: VisualizationVisMatrixComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_tree', component: VisualizationVisTreeComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_distribution', component: VisualizationVisDistributionComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_cluster', component: VisualizationVisClusterComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_directed', component: VisualizationVisDirectedComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_2clause', component: VisualizationVis2ClauseComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_dpll', component: VisualizationVisDpllComponent, canActivate: [AuthGuard]},
  {path: 'visualization-vis_heatmap', component: VisualizationVisHeatmapComponent, canActivate: [AuthGuard]},
  {path: 'visualization-raw', component: VisualizationRawComponent, canActivate: [AuthGuard]},
  {path: 'sat', component: SatComponent, canActivate: [AuthGuard]},
  {path: 'maxsat', component: MaxsatComponent, canActivate: [AuthGuard]},
  {path: 'visualizations', component: VisualizationsComponent, canActivate: [AuthGuard]},
  {path: 'logout', component: LogoutComponent},
  {path: 'edit', component: EditAccountComponent},
  {path: 'docs', component: DocsComponent},
  {path: '**', component: SatComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MenuComponent,
    AlertComponent,
    SatComponent,
    VisualizationVisResolutionComponent,
    VisualizationVisFactorComponent,
    VisualizationVisInteractionComponent,
    VisualizationVisMatrixComponent,
    VisualizationVisTreeComponent,
    VisualizationVisClusterComponent,
    VisualizationVisDistributionComponent,
    VisualizationVisDirectedComponent,
    VisualizationVis2ClauseComponent,
    VisualizationVisDpllComponent,
    VisualizationRawComponent,
    VisMenuComponent,
    MaxsatComponent,
    LogoutComponent,
    VisualizationsComponent,
    ModalProgressComponent,
    VisualizationVisDistributionComponent,
    ModalBadFileComponent,
    DocsComponent,
    EditAccountComponent,
    VisualizationVisCommunityComponent,
    VisualizationVisHeatmapComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
    SelectDropDownModule,
    RecaptchaModule,
    NgbModule.forRoot(),
    NgSelectModule
  ],

  providers: [
    AuthGuard,
    AlertService,
    RegisterService,
    AuthService,
    FileService,
    VisMenuService,
    JsonfileService,
    UserService
  ],

  entryComponents: [
    ModalProgressComponent,
    ModalBadFileComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
