import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { isInteger } from "@ng-bootstrap/ng-bootstrap/util/util";

@Component({
  selector: "app-manage-time",
  templateUrl: "./manage-time.component.html",
  styleUrls: ["./manage-time.component.scss"],
})
export class ManageTimeComponent implements OnInit {
  public timeEnd = { hour: 0, minute: 0, second: 0 };
  public timeStart = { hour: 0, minute: 0, second: 0 };
  time: any;
  disableTimeStart: boolean = true;
  disableTimeEnd: boolean = true;
  constructor(private http: HttpService) {}

  async ngOnInit() {
    await this.getTime();
    this.setTimeShoew();
  }

  editTimeStar = async () => {
    this.disableTimeStart = !this.disableTimeStart;
  };
  editTimeEnd = async () => {
    this.disableTimeEnd = !this.disableTimeEnd;
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
}
