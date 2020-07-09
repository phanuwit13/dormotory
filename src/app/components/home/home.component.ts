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
  public mode = "side";
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
    this.getPath();
    if (window.screen.width <= 480) {
      this.mode = "over";
      //console.log(window.screen.width);
    } else {
      this.mode = "side";
      console.log(window.screen.width);
    }
  }

  logOut = async () => {
    await window.localStorage.clear();
    this.http.navRouter(this.oldPath);
  };
  async attive(key: number, path: string) {
    this.getPathName(path);
    console.log(key);
    // this.pathname = await window.location.pathname;
    this.className = [false, false, false, false, false, false, false];
    this.className.forEach((item, index) => {
      if (index == key) {
        this.className[index] = true;
        return;
        console.log(item);
      } else {
        this.className[index] = false;
      }
    });
  }
  async getPathName(value) {
    this.pathname = value;
  }
  async getPath() {
    this.pathname = window.location.pathname.split("/home/")[1];
  }
}
