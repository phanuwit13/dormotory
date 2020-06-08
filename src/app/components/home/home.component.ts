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
  public pathname = null;
  public className = [false, false, false, false, false, false, false];
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
  }

  logOut = async () => {
    await window.localStorage.clear();
    this.http.navRouter(this.oldPath);
  };
  async attive(key: number) {
    console.log(key);
    // this.pathname = await window.location.pathname;
    this.className.forEach((item, index) => {
      if (index == key) {
        this.className[index] = true;
        console.log(item);
      } else {
        this.className[index] = false;
      }
    });
  }
}
