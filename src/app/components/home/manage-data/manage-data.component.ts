import { FormControl, FormGroup } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-manage-data",
  templateUrl: "./manage-data.component.html",
  styleUrls: ["./manage-data.component.scss"],
})
export class ManageDataComponent implements OnInit {
  public formStd_code: FormGroup;
  public nameStudent: Array<any> = null;
  public floor = [];
  public userData: Array<any> = null;
  public keyStd = new FormControl();
  p: number = 1;

  constructor(private http: HttpService) {}

  async ngOnInit() {
    let httpRespon: any = await this.http.post("cardData");
    console.log(httpRespon);
    if (httpRespon.response.length > 0) {
      this.userData = httpRespon.response;
    } else {
      this.userData = null;
    }
    this.getFloor();
  }
  async getStdcode(std) {
    this.nameStudent = null;
    let formData = new FormData();
    formData.append("std_code", std);
    let httpRespon: any = await this.http.post("Rulestdname", formData);
    console.log(httpRespon);
    if (httpRespon.response.length > 0) {
      this.nameStudent = httpRespon.response;
    } else {
      this.nameStudent = null;
      alert("ไม่พบข้อมูล");
    }
  }
  async getFloor() {
    let httpRespon: any = await this.http.post("floor");
    console.log(httpRespon);
    if (httpRespon.response.length > 0) {
      this.floor = httpRespon.response;
    } else {
      this.floor = null;
    }
  }

  async searchStd() {
    this.userData = null;
    console.log(this.keyStd.value);
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    let httpRespon: any = await this.http.post("search", formData);
    console.log(httpRespon);
    if (httpRespon.response.length > 0) {
      this.userData = httpRespon.response;
      console.log("พบ");
    } else {
      this.userData = null;
      console.log("ไม่พบ");
    }
  }
}
