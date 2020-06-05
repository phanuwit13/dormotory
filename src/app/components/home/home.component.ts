import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public userLogin: any = null;
  private oldPath: string = "/login";
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  events: string[] = [];
  opened: boolean;

  constructor(
    private http: HttpService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  async ngOnInit() {
    this.userLogin = await JSON.parse(window.localStorage.getItem("userLogin"));
    console.log(this.userLogin);
  }
  logOut = async () => {
    await window.localStorage.clear();
    this.http.navRouter(this.oldPath);
  };
}
