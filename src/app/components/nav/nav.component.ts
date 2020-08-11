import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { HttpService } from "src/app/services/http.service";
@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private oldPath: string = "/login";
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private http: HttpService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logOut = async () => {
    await window.localStorage.clear();
    this.http.navRouter(this.oldPath);
  };
  rout(path) {
    this.http.navRouter("/nav/" + path);
  }
}
