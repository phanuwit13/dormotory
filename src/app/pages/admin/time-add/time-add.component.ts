import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
@Component({
  selector: "app-time-add",
  templateUrl: "./time-add.component.html",
  styleUrls: ["./time-add.component.scss"],
})
export class TimeAddComponent implements OnInit {
  public date = new Date();
  public formLogin: FormGroup;
  public userStd: any = null;
  public statusTime: any;
  public timeStart: any;
  public timeEnd: any;
  public dataStd: any = null;
  public hours: any;
  public minutes: any;
  p: number = 1;
  public focus = "inputStd";
  public confirm = new FormControl();

  constructor(private formBuilder: FormBuilder, private http: HttpService) {}

  ngOnInit() {
    this.confirm.setValue(false);
    setInterval(() => {
      document.getElementById(this.focus).focus();
    }, 1000);
    this.formLogin = this.formBuilder.group({
      std_code: ["", Validators.required],
      date_stamp: ["", Validators.required],
      time_stamp: ["", Validators.required],
      time_status: ["", Validators.required],
      keyStd: "",
    });
    console.log(
      this.date.getFullYear() +
        "-" +
        (this.date.getMonth() + 1) +
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
    formData.append("std_code", this.formLogin.controls["std_code"].value);
    formData.append(
      "date_stamp",
      dateZone.getFullYear() +
        "-" +
        (dateZone.getMonth() + 1) +
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
    formData.forEach((x, key) => {
      console.log(key + ":" + x);
    });
    let httpResponData: any = await this.http.post("settime", formData);
    console.log(httpResponData.response.success);
    if (httpResponData.response.success) {
      console.log(httpResponData.response.data);
      this.setCursor();
      Swal.fire({
        showConfirmButton: false,
        icon: "success",
        title: "สำเร็จ",
        text: "บันทึกเวลาสำเร็จ !",
        timer: 1000,
      });
    } else {
      Swal.fire({
        showConfirmButton: false,
        icon: "error",
        title: "ไม่สำเร็จ",
        text: "บันทึกเวลาไม่สำเร็จ !",
        timer: 1000,
      });
    }
  };

  async getStdcode() {
    let formData = new FormData();
    formData.append("std_code", this.formLogin.controls["std_code"].value);
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("getStudent", formData);
    console.log(httpRespon);
    if (httpRespon.response.success) {
      this.dataStd = httpRespon.response.data;
      console.log(httpRespon.response);
      //this.setCursor();
      //document.getElementById("success").click();
      return true;
    } else {
      this.dataStd = null;
      //this.setCursor();
      return false;
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
    this.formLogin.controls["keyStd"].setValue("");
  };
  setFocus(str) {
    this.focus = str;
    console.log(this.focus);
    this.userStd = null;
  }
  async getStudent() {
    if (this.formLogin.controls["keyStd"].value != "") {
      console.log(this.formLogin.controls["keyStd"].value);
      let formData = new FormData();
      formData.append("keyStd", this.formLogin.controls["keyStd"].value);
      formData.append("status", "1");
      let httpRespon: any = await this.http.post("searchNameStd", formData);
      console.log(httpRespon);
      if (httpRespon.response.success) {
        this.userStd = httpRespon.response.data;
        console.log(httpRespon.response);
      } else {
        this.userStd = null;
      }
    } else {
      this.userStd = null;
    }
  }
  async checkConfirm() {
    if ((await this.getStdcode()) == true) {
      if (this.confirm.value == true) {
        document.getElementById("success").click();
        // Swal.fire({
        //   icon: "success",
        //   title: "สำเร็จ",
        //   text: "บันทึกเวลาสำเร็จ !",
        //   timer: 1000,
        // });
      } else {
        this.addTime();
        Swal.fire({
          showConfirmButton: false,
          icon: "success",
          title: "สำเร็จ",
          text: "บันทึกเวลาสำเร็จ !",
          timer: 1000,
        });
      }
    } else {
      this.setCursor();
      Swal.fire({
        showConfirmButton: false,
        icon: "error",
        title: "ไม่สำเร็จ",
        text: "บันทึกเวลาไม่สำเร็จ !",
        timer: 1000,
      });
    }
  }
  async setNameAddTime(stdCode) {
    document.getElementById("close").click();
    this.formLogin.controls["std_code"].setValue(stdCode);
    if ((await this.getStdcode()) == true) {
      document.getElementById("success").click();
    } else {
      this.setCursor();
      Swal.fire({
        showConfirmButton: false,
        icon: "error",
        title: "ไม่สำเร็จ",
        text: "บันทึกเวลาไม่สำเร็จ !",
        timer: 1000,
      });
    }
  }
}
