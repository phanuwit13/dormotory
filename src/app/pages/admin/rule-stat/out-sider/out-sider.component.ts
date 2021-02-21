import { NgxSpinnerService } from "ngx-spinner";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { Sort } from "@angular/material/sort";

@Component({
  selector: "app-out-sider",
  templateUrl: "./out-sider.component.html",
  styleUrls: ["./out-sider.component.scss"],
})
export class OutSiderComponent implements OnInit {
  public userData: Array<any> = null;
  public ruleHistory: Array<any> = [];
  public dataOld: Array<any> = null;
  allComplete: boolean = false;
  //term = new FormControl();
  public ruleChoice = [];
  public formStd_code: FormGroup;
  public formSearch: FormGroup;
  public floor = [];
  public keyStd = new FormControl();
  public p: number = 1;
  public Faculty = [];
  public branch = [];
  public levels = [];
  public checkConnect: any = false;
  public term = [1, 2, 3];
  data: any = [];
  public showColumn = new FormControl();
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
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.formStd_code = this.formBuilder.group({
      std_code: ["", Validators.required],
      nameTitle: ["", Validators.required],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      faculty_code: ["", Validators.required],
      branch_code: ["", Validators.required],
      groupStd: ["", Validators.required],
      floor: ["", Validators.required],
      room_number: ["", Validators.required],
      phone: ["", Validators.required],
      noLevel: ["", Validators.required],
    });
    this.formSearch = this.formBuilder.group({
      date: new Date(),
      typeSelect: "",
      months: null,
      term: null,
      rules_number: "",
    });
    this.getRule();
    await this.spinner.show();
    this.getStdRule().then(async (value) => {
      if (value == true) {
        this.spinner.hide();
      }
    });
  }

  getStdRule = async () => {
    let httpRespon: any = await this.http.post("getOutsiderRule");
    this.checkConnect = true;
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      this.dataOld = this.userData
      return true;
    } else {
      this.userData = null;
      this.dataOld = this.userData
      return true;
    }
  };

  async getRule() {
    let httpRespon: any = await this.http.post("Rule");
    if (httpRespon.response.data.length > 0) {
      this.ruleChoice = httpRespon.response.data;
    } else {
      this.ruleChoice = null;
    }
  }
  advancedSearch = () => {
    this.getFloor();
    this.getLevels();
  };
  async getLevels() {
    let httpRespon: any = await this.http.post("level");
    if (httpRespon.response.data.length > 0) {
      this.levels = httpRespon.response.data;
    } else {
      this.levels = null;
    }
  }
  async getFloor() {
    let httpRespon: any = await this.http.post("floor");
    if (httpRespon.response.data.length > 0) {
      this.floor = httpRespon.response.data;
    } else {
      this.floor = null;
    }
  }
  async getFaculty() {
    let httpRespon: any = await this.http.post("Faculty");
    if (httpRespon.response.data.length > 0) {
      this.Faculty = httpRespon.response.data;
    } else {
      this.Faculty = null;
    }
  }
  async getBranch(fcl, lev) {
    let formData = new FormData();
    formData.append("faculty_code", fcl);
    formData.append("noLevel", lev);
    let httpRespon: any = await this.http.post("Branch", formData);
    if (httpRespon.response.data.length > 0) {
      this.branch = httpRespon.response.data;
    } else {
      this.branch = null;
    }
  }
  getAdvancedSearchData = async () => {
    let formData = new FormData();
    let date = new Date();
    if (this.formSearch.value["typeSelect"] == 1) {
      let date = this.getDate();
      this.formSearch.controls["months"].setValue("");
      this.formSearch.controls["term"].setValue("");
      this.formSearch.controls["date"].setValue(date);
    } else if (this.formSearch.value["typeSelect"] == 2) {
      this.formSearch.controls["date"].setValue("");
      this.formSearch.controls["term"].setValue("");
    } else if (this.formSearch.value["typeSelect"] == 3) {
      this.formSearch.controls["months"].setValue("");
      this.formSearch.controls["date"].setValue("");
    } else {
      this.formSearch.controls["months"].setValue("");
      this.formSearch.controls["date"].setValue("");
      this.formSearch.controls["term"].setValue("");
    }
    //วนลูบเก็บค่า key และ value
    Object.keys(this.formSearch.value).forEach((key) => {
      formData.append(key, this.formSearch.value[key]);
    });
    let httpRespon: any = await this.http.post(
      "advancedSearchRuleOut",
      formData
    );
    if (httpRespon.response.success) {
      this.userData = httpRespon.response.data;
      this.dataOld = this.userData
    } else {
      this.userData = null;
      this.dataOld = this.userData
    }
    this.clearFormSearch();
  };
  getDate() {
    let year = this.formSearch.value.date.getFullYear();
    let month = this.formSearch.value.date.getMonth();
    let day = this.formSearch.value.date.getDate();
    month = (month + 1)
    if (month < 10) {
      month = "0" + month
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  }
  clearFormSearch() {
    Object.keys(this.formSearch.value).forEach((key) => {
      this.formSearch.controls[key].setValue("");
    });
    this.formSearch.controls["date"].setValue(new Date());
  }
  exportAsXLSX(): void {
    if (this.ruleHistory.length == 0) {
      Swal.fire("", "กรุณาเลือกข้อมูล", "error");
    } else {
    this.ruleHistory.forEach((item) => {
      let str = "";
      if (item.house_no != "") {
        str += item.house_no;
      }
      if (item.moo != "") {
        str += " หมู่ " + item.moo;
      }
      if (item.sub_district != "") {
        str += " ตำบล " + item.sub_district;
      }
      if (item.district != "") {
        str += " อำเภอ " + item.district;
      }
      if (item.province != "") {
        str += " จังหวัด " + item.province;
      }
      if (item.other != "") {
        this.data.push({
          วันที่: item.date_rule,
          เวลา: item.time_rule,
          บัตรประชาชน: item.id_card_code,
          "ชื่อ - สกุล": item.nameOutsider,
          ที่อยู่: str,
          ชื่อบิดา: item.father,
          เบอร์บิดา: item.f_phone,
          ชื่อมารดา: item.mother,
          เบอร์มารดา: item.m_phone,
          นักศึกษาที่เกี่ยวข้อง: item.nameStd,
          เกี่ยวข้องเป็น: item.student_relation,
          กระทำผิดกฏ: item.other,
          รายละเอียด: item.details,
        });
      } else {
        this.data.push({
          วันที่: item.date_rule,
          เวลา: item.time_rule,
          บัตรประชาชน: item.id_card_code,
          "ชื่อ - สกุล": item.nameOutsider,
          ที่อยู่: str,
          ชื่อบิดา: item.father,
          เบอร์บิดา: item.f_phone,
          ชื่อมารดา: item.mother,
          เบอร์มารดา: item.m_phone,
          นักศึกษาที่เกี่ยวข้อง: item.nameStd,
          เกี่ยวข้องเป็น: item.student_relation,
          กระทำผิดกฏ: item.rules_name,
          รายละเอียด: item.details,
        });
      }
    });

    this.http.exportAsExcelFile(
      this.data,
      "ผลการกระทำผิดกฎของบุคคลภายนอก_" + this.getDate()
    );
    this.data = [];
    }
  }

  async searchOut() {
    this.userData = [];
    this.dataOld = this.userData
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    let httpRespon: any = await this.http.post("searchRuleStatOut", formData);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      this.dataOld = this.userData
    } else {
      this.userData = [];
      this.dataOld = this.userData
    }
  }
  async deleteHis() {
    if (this.ruleHistory.length == 0) {
      Swal.fire("", "กรุณาเลือกข้อมูล", "error");
    } else {
      Swal.fire({
        title: "",
        text: "ยืนยันการลบข้อมูล!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง !",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        let formData = new FormData();
        var noHistory: any = this.ruleHistory.map((x) => {
          return x.rules_no;
        });
        formData.append("noHistory", noHistory);
        let httpRespon: any = await this.http.post("deleteRuleHis", formData);
        if (httpRespon.response.success) {
          await this.spinner.show();
          this.getStdRule().then(async (value) => {
            if (value == true) {
              this.spinner.hide();
            }
          });
          this.ruleHistory = [];
          this.allComplete = false;
        } else {
          Swal.fire("", httpRespon.response.message, "error");
        }
      });
    }
  }

  checkAll(ev) {
    if (ev.checked) {
      this.userData.forEach((x) => {
        if (x.state != ev.checked) {
          this.ruleHistory.push(x);
          x.state = ev.checked;
        }
      });
    } else {
      this.userData.forEach((x) => {
        x.state = ev.checked;
      });
      this.ruleHistory = [];
    }
  }

  addStdCard = async (value, check) => {

    if (check == true) {
      this.ruleHistory.push(value);
    } else {
      this.ruleHistory = this.ruleHistory.filter((item) => {
        if (item != value) {
          return item;
        }
      });
    }
    if (this.ruleHistory.length == this.userData.length) {
      this.allComplete = true;
    } else {
      this.allComplete = false;
    }
  };

  sortData(sort: Sort) {
    if (this.userData == null) {
      return;
    }
    const data = this.userData.slice();
    if (!sort.active || sort.direction === "") {
      this.userData = this.dataOld.slice();
      return;
    }
    this.userData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "date_rule":
          return compare(a.date_rule, b.date_rule, isAsc);
        case "time_rule":
          return compare(a.time_rule, b.time_rule, isAsc);
        case "id_card_code":
          return compare(a.id_card_code, b.id_card_code, isAsc);
        case "nameOutsider":
          return compare(a.nameOutsider, b.nameOutsider, isAsc);
        case "district":
          return compare(a.district, b.district, isAsc);
        case "father":
          return compare(a.father, b.father, isAsc);
        case "mother":
          return compare(a.mother, b.mother, isAsc);
        case "nameStd":
          return compare(a.nameStd, b.nameStd, isAsc);
        case "student_relation":
          return compare(a.student_relation, b.student_relation, isAsc);
        case "rules_name":
          return compare(a.rules_name, b.rules_name, isAsc);
          case "details":
            return compare(a.details, b.details, isAsc);
        default:
          return 0;
        
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

