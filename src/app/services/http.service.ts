import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  public rootPath: string =
    "http://cpe.rmuti.ac.th/project/dormitory/webtest/index.php/";
  constructor(private http: HttpClient) {}
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
}
