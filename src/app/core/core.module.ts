import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { AngularFireModule } from "@angular/fire";
import { environment } from '../../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  imports: [
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  exports: [
    NavbarComponent
  ],
  declarations: [NavbarComponent]
})
export class CoreModule { }
