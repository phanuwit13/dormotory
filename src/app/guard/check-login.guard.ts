import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { HttpService } from "../services/http.service";

@Injectable({
  providedIn: "root",
})
export class CheckLoginGuard implements CanActivate {
  constructor(private service: HttpService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.service.localStorage.get("userLogin").role == "admin") {
      this.service.setUserLogin(this.service.localStorage.get("userLogin"));
      console.log(this.service.localStorage.get("userLogin"));
      return true;
    }

    this.service.navRouter("/login", { oldPath: state.url });
    return false;
  }
}
