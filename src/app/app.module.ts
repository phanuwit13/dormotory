import { HttpService } from "./services/http.service";
import { SharedModules } from "./Shared-Modules";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { NavComponent } from "./components/nav/nav.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AddtimeComponent } from "./components/home/addtime/addtime.component";

import { CardGenComponent } from "./components/home/card-gen/card-gen.component";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AddtimeComponent,
    CardGenComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModules,
    BrowserAnimationsModule,
  ],
  providers: [HttpService],
  bootstrap: [AppComponent],
})
export class AppModule {}
