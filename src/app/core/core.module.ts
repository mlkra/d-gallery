import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    NavbarComponent
  ],
  declarations: [NavbarComponent]
})
export class CoreModule { }
