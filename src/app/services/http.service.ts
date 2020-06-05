import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  public rootPath: string =
    "http://cpe.rmuti.ac.th/project/dormitory/webtest/index.php/";
  private userLogin: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  public post = (path: string, formdata: any = null) => {
    return new Promise((resolve) => {
      this.http
        .post(this.rootPath + path, formdata)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
        });
    });
  };

  public get = (path: string) => {
    return new Promise((resolve) => {
      this.http
        .get(this.rootPath + path)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
        });
    });
  };

  public localStorage = {
    get: (key: string) => {
      return JSON.parse(window.localStorage.getItem(key));
    },
    set: (key: string, value: any) => {
      value = JSON.stringify(value);
      window.localStorage.setItem(key, value);
    },
    clear: () => {
      window.localStorage.clear();
    },
  };

  public setUserLogin = (data: any) => {
    this.userLogin = data;
    this.localStorage.set("userLogin", data);
  };

  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };
}
