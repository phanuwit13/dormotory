import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";

@Component({
  selector: "app-time-manage",
  templateUrl: "./time-manage.component.html",
  styleUrls: ["./time-manage.component.scss"],
})
export class TimeManageComponent implements OnInit {
  public formTime: FormGroup;
  public timeEnd = { hour: 0, minute: 0, second: 0 };
  public timeStart = { hour: 0, minute: 0, second: 0 };
  public disableBtn = { start: false, end: false };
  public time: any;
  public disableTime = { start: true, end: true };
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  async ngOnInit() {
    await this.getTime();
    this.setTimeShoew();
  }

  editTime = async (value) => {
    this.disableTime[value] = !this.disableTime[value];
    this.changeDisable(value);
  };

  getTime = async () => {
    let httpRespon: any = await this.http.post("/getTimeSet");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.time = await httpRespon.response.data;
    } else {
      this.time = null;
    }
  };

  setTimeShoew() {
    this.timeStart = {
      hour: parseInt(this.time[0].timeStart.split(":")[0]),
      minute: parseInt(this.time[0].timeStart.split(":")[1]),
      second: 0,
    };
    this.timeEnd = {
      hour: parseInt(this.time[0].timeEnd.split(":")[0]),
      minute: parseInt(this.time[0].timeEnd.split(":")[1]),
      second: 0,
    };
    console.log(this.timeStart);
  }

  setTimeStart = async () => {
    let formData = new FormData();
    formData.append(
      "timeStart",
      this.timeStart.hour + ":" + this.timeStart.minute
    );
    let httpRespone = await this.http.post("/setTimeSet", formData);
    console.log(httpRespone);
    await this.getTime();
    this.setTimeShoew();
    this.canseltimeSet("start");
  };

  setTimeEnd = async () => {
    let formData = new FormData();
    formData.append("timeEnd", this.timeEnd.hour + ":" + this.timeEnd.minute);
    let httpRespone = await this.http.post("/setTimeSet", formData);
    console.log(httpRespone);
    await this.getTime();
    this.setTimeShoew();
    this.canseltimeSet("end");
  };
  changeDisable(value) {
    this.disableBtn[value] = !this.disableBtn[value];
  }
  canseltimeSet(value) {
    this.disableTime[value] = !this.disableTime[value];
    this.changeDisable(value);
  }
}
