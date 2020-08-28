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
    formData.append("std_code", this.formLogin.controls["std_code"].value);
    formData.append("date_stamp", this.setDate());
    formData.append("time_stamp", this.setTime());
    this.timeStart = await this.getTimeSet();
    // console.log(this.timeStart[0]);
    // console.log("Start: " + this.timeStart[0].timeStart);
    // console.log("End: " + this.timeStart[0].timeEnd);
    // console.log("Time: " + dateZone.getHours() + ":" + dateZone.getMinutes());
    let timeStart = this.timeStart[0].timeStart.split(":");
    let timeEnd = this.timeStart[0].timeEnd.split(":");
    //console.log(parseInt(h[0].toInteger)+"");
    //||this.date.getHours() < 5
    if (timeStart[0] > timeEnd[0]) {
      this.statusTime = await this.startOverEnd(timeStart, timeEnd);
      console.log("เวลาเริ่มต้นมากกว่าสิ้นสุด");
    } else if (timeStart[0] < timeEnd[0]) {
      this.statusTime = await this.endOverStart(timeStart, timeEnd);
      console.log("เวลาสิ้นสุดมากกว่าเริ่มต้น");
    } else {
      this.statusTime = await this.timeEqual(timeStart, timeEnd);
      console.log("เวลาเท่ากัน"); 
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

  async startOverEnd(timeStart, timeEnd) {
    let dateZone = new Date();
    if (
      dateZone.getHours() <= timeStart[0] &&
      dateZone.getHours() >= timeEnd[0]
    ) {
      //this.statusTime = 0;
      if (dateZone.getHours() == timeStart[0]) {
        if (dateZone.getMinutes() > timeStart[1]) {
          return 1;
        } else {
          return 0;
        }
      } else if (dateZone.getHours() == timeEnd[0]) {
        if (dateZone.getMinutes() < timeEnd[1]) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 1;
    }
  }

  async endOverStart(timeStart, timeEnd) {
    let dateZone = new Date();
    if (
      dateZone.getHours() >= timeStart[0] &&
      dateZone.getHours() <= timeEnd[0]
    ) {
      //this.statusTime = 0;
      if (dateZone.getHours() == timeStart[0]) {
        if (dateZone.getMinutes() > timeStart[1]) {
          return 1;
        } else {
          return 0;
        }
      } else if (dateZone.getHours() == timeEnd[0]) {
        if (dateZone.getMinutes() < timeEnd[1]) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }

  async timeEqual(timeStart, timeEnd) {
    let dateZone = new Date();
      if (dateZone.getMinutes() > timeStart[1] && dateZone.getMinutes() < timeEnd[1] ) {
        return 1;
      } else {
        return 0;
      }
  }

  async getStdcode() {
    let formData = new FormData();
    formData.append("std_code", this.formLogin.controls["std_code"].value);
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("getStudent", formData);
    console.log(httpRespon);
    if (httpRespon.response.success) {
      this.dataStd = httpRespon.response.data;
      console.log(httpRespon.response);
      return true;
    } else {
      this.dataStd = null;
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

    return this.hours + ":" + this.minutes;
  };

  setDate = () => {
    let dateZone = new Date();
    return (
      dateZone.getFullYear() +
      "-" +
      (dateZone.getMonth() + 1) +
      "-" +
      dateZone.getDate()
    );
  };
  getTimeSet = async () => {
    let httpResponTime: any = await this.http.post("getTimeSet");
    if (httpResponTime.response.success) {
      return httpResponTime.response.data;
    } else {
      return null;
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
  async searchStudent() {
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
