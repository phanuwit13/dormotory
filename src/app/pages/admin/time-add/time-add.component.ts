import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-time-add",
  templateUrl: "./time-add.component.html",
  styleUrls: ["./time-add.component.scss"],
})
export class TimeAddComponent implements OnInit {
  public date = new Date();
  public formLogin: FormGroup;
  public userLogin: any = null;
  public statusTime: any;
  public timeStart: any;
  public timeEnd: any;
  public dataStd: any;
  public hours: any;
  public minutes: any;
  constructor(private formBuilder: FormBuilder, private http: HttpService) {}

  ngOnInit() {
    setInterval(() => {
      document.getElementById("inputStd").focus();
    }, 1000);
    this.formLogin = this.formBuilder.group({
      std_code: ["", Validators.required],
      date_stamp: ["", Validators.required],
      time_stamp: ["", Validators.required],
      time_status: ["", Validators.required],
    });
    console.log(
      this.date.getFullYear() +
        "-" +
        this.date.getMonth() +
        "-" +
        this.date.getDate()
    );
    console.log(this.date.getHours() + ":" + this.date.getMinutes());
    console.log(this.date.getTime());
  }
  addTime = async () => {
    let dateZone = new Date();
    let formData = new FormData();
    this.setTime();
    formData.append("std_code", this.formLogin.value["std_code"]);
    formData.append(
      "date_stamp",
      dateZone.getFullYear() +
        "-" +
        dateZone.getMonth() +
        "-" +
        dateZone.getDate()
    );
    formData.append("time_stamp", this.hours + ":" + this.minutes);
    let httpResponTime: any = await this.http.post("getTimeSet");
    this.timeStart = httpResponTime.response.data;
    console.log(this.timeStart[0]);
    console.log("Start: " + this.timeStart[0].timeStart);
    console.log("End: " + this.timeStart[0].timeEnd);
    console.log("Time: " + dateZone.getHours() + ":" + dateZone.getMinutes());
    let h = this.timeStart[0].timeStart.split(":");
    let h2 = this.timeStart[0].timeEnd.split(":");
    //console.log(parseInt(h[0].toInteger)+"");
    //||this.date.getHours() < 5
    if (dateZone.getHours() < h[0] && dateZone.getHours() > h2[0]) {
      this.statusTime = 0;
      console.log("ไม่สาย1");
    } else if (dateZone.getHours() == h[0]) {
      if (dateZone.getMinutes() > h[1]) {
        this.statusTime = 1;
        console.log("สาย2");
      } else {
        this.statusTime = 0;
        console.log("ไม่สาย2");
      }
    } else if (dateZone.getHours() == h2[0]) {
      if (dateZone.getMinutes() < h2[1]) {
        this.statusTime = 1;
        console.log("สาย3");
      } else {
        this.statusTime = 0;
        console.log("ไม่สาย3");
      }
    } else {
      this.statusTime = 1;
      console.log("สาย5");
    }
    formData.append("time_status", this.statusTime);
    console.log("-------------------------------");
    formData.forEach((x) => {
      console.log(x);
    });

    let httpResponData: any = await this.http.post("settime", formData);
    if (httpResponData.response.data.length > 0) {
      console.log(httpResponData.response.data);
    } else {
      console.log("ไม่เจอ");
    }
  };

  async getStdcode(std) {
    let formData = new FormData();
    formData.append("std_code", std);
    let httpRespon: any = await this.http.post("getStudent", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.dataStd = httpRespon.response.data;
      console.log(httpRespon.response);
      document.getElementById("suscess").click();
    } else {
      console.log("ไม่เจอ");
      document.getElementById("none").click();
      this.dataStd = null;
    }
  }
  setTime = () => {
    let dateZone = new Date();
    if (dateZone.getHours() < 10) {
      this.hours = "0" + dateZone.getHours();
    } else {
      this.hours = dateZone.getHours();
    }
    if (dateZone.getMinutes() < 10) {
      this.minutes = "0" + dateZone.getMinutes();
    } else {
      this.minutes = dateZone.getMinutes();
    }
  };

  setCursor = () => {
    this.formLogin.controls["std_code"].setValue("");
  };
}
