import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
@Component({
  selector: "app-stat-rule",
  templateUrl: "./stat-rule.component.html",
  styleUrls: ["./stat-rule.component.scss"],
})
export class StatRuleComponent implements OnInit {
  public userData: Array<any> = null;
  floor = new FormControl();
  months = new FormControl();
  term = new FormControl();
  ruleChoice = [];

  t = new Date();
  favoriteSeason: string;

  monthsList: string[] = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤษจิกายน",
    "ธันวาคม",
  ];
  floorList: string[] = ["2", "3", "4", "5", "6", "7", "8"];

  constructor(private http: HttpService) {}

  async ngOnInit() {
    let httpRespon: any = await this.http.post("getStdRule");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
    } else {
      this.userData = null;
    }
    this.getRule();
  }
  async getRule() {
    let httpRespon: any = await this.http.post("Rule");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.ruleChoice = httpRespon.response.data;
    } else {
      this.ruleChoice = null;
    }
  }

  getTerm = () => {
    let time = new Date();
    let data = {
      term:
        time.getMonth() >= 5 && time.getMonth() <= 9
          ? 1
          : (time.getMonth() >= 10 && time.getMonth() <= 11) ||
            (time.getMonth() >= 0 && time.getMonth() <= 2)
          ? 2
          : time.getMonth() > 2 && time.getMonth() < 5
          ? 3
          : "",
      yearThai: time.getFullYear() + 543,
    };

    return data;
  };
}
