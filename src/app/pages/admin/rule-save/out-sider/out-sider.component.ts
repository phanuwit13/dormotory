import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
declare var require: any;
@Component({
  selector: "app-out-sider",
  templateUrl: "./out-sider.component.html",
  styleUrls: ["./out-sider.component.scss"],
})
export class OutSiderComponent implements OnInit {
  public formStd_code: FormGroup;
  public titleName = ["นาย", "นาง", "นางสาว", "MR.", "MISS.", "MRS."];
  public other = { rules_number: 16, rules_name: "อื่นๆ" };
  public provinces: Array<
    any
  > = require("../../../../services/Thailand-Address-master/provinces.json");
  public district: Array<any>;
  public sub_district: Array<any>;
  public ruleChoice: Array<any> = null;
  public nameStudent: Array<any> = null;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.formStd_code = this.formBuilder.group({
      std_code: ["", Validators.required],
      rulesBreak: ["", Validators.required],
      date_rule: [new Date(), Validators.required],
      time_rule: [this.setTime(), Validators.required],
      other: "",
      details: "",
      id_card_code: ["", Validators.required],
      nameTitle: ["", Validators.required],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      phone: ["", Validators.required],
      house_no: "",
      moo: "",
      sub_district: "",
      district: "",
      province: "",
      father: "",
      f_phone: "",
      mother: "",
      m_phone: "",
      student_relation: ["", Validators.required],
    });

    this.getRule();
  }
  async getDistrict(PROVINCE_ID) {
    this.district = await require("../../../../services/Thailand-Address-master/districts.json");
    let n = this.district.length;

    this.district = this.district.filter((item) => {
      return item.PROVINCE_ID == PROVINCE_ID;
    });
  }
  async getSubDistrict(DISTRICT_ID) {
    this.sub_district = await require("../../../../services/Thailand-Address-master/subDistricts.json");
    let n = this.district.length;

    this.sub_district = this.sub_district.filter((item) => {
      return item.DISTRICT_ID == DISTRICT_ID;
    });
  }

  async getRule() {
    let httpRespon: any = await this.http.post("Rule");
    if (httpRespon.response.data.length > 0) {
      this.ruleChoice = httpRespon.response.data;
      this.ruleChoice = this.ruleChoice.filter((item) => {
        return item.rules_number != 16;
      });
      this.ruleChoice.push(this.other);
    } else {
      this.ruleChoice = null;
    }
  }

  public getStdcode = async () => {
    let formData = new FormData();
    formData.append("std_code", this.formStd_code.value.std_code);
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("getStudent", formData);
    if (httpRespon.response.data.length > 0) {
      this.nameStudent = httpRespon.response.data;
    } else {
      this.nameStudent = null;
    }
  };

  public setOutsiderRule = async () => {
    Swal.fire({
      title: "",
      text: "ยืนยันการบันทึกการกระทำผิดกฎ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        let formData = new FormData();
        let date_rule = this.getDate();
        Object.keys(this.formStd_code.value).forEach((key) => {
          formData.append(key, this.formStd_code.value[key]);
        });
        formData.append("date_rule", date_rule);
        if (this.formStd_code.value["province"] != "") {
          formData.append("province", this.formStd_code.value["province"][1]);
          if (this.formStd_code.value["district"] != "") {
            formData.append("district", this.formStd_code.value["district"][1]);
          }
        }
        let httpRespon: any = await this.http.post("setOutsider", formData);
        if (httpRespon.response.success) {
          let httpRespon: any = await this.http.post(
            "setStudentRule",
            formData
          );
          if (httpRespon.response.success) {
            Swal.fire("สำเร็จ", httpRespon.response.message, "success");
            this.clearFormSearch();
          } else {
            Swal.fire("ไม่สำเร็จ", httpRespon.response.message, "error");
          }
        } else {
          Swal.fire("ไม่สำเร็จ", httpRespon.response.message, "error");
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    });
  };
  clearFormSearch() {
    this.nameStudent = null;
    Object.keys(this.formStd_code.value).forEach((key) => {
      this.formStd_code.controls[key].setValue("");
    });
    this.formStd_code.controls["date_rule"].setValue(new Date());
    this.formStd_code.controls["id_card_code"].setValue(null);
    this.formStd_code.controls["time_rule"].setValue(this.setTime());
  }
  getDate() {
    let year: any = this.formStd_code.value.date_rule.getFullYear();
    let month: any = this.formStd_code.value.date_rule.getMonth() + 1;
    let day: any = this.formStd_code.value.date_rule.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  }
  setTime = () => {
    let dateZone = new Date();
    let hours = "";
    let minutes = "";
    if (dateZone.getHours() < 10) {
      hours = "0" + dateZone.getHours();
    } else {
      hours = dateZone.getHours() + "";
    }
    if (dateZone.getMinutes() < 10) {
      minutes = "0" + dateZone.getMinutes();
    } else {
      minutes = dateZone.getMinutes() + "";
    }
    return hours + ":" + minutes;
  };
  checkType(st, value) {
    let str = this.formStd_code.value[st].split("");
    if ((value == "num")) {
      for (let i = 0; i < str.length; i++) {
        if ((str[i] >= "0" && str[i] <= "9") || str[i] == "-") {
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: "ป้อนค่าได้แค่ตัวเลข",
          });
          this.formStd_code.controls[st].setValue("");
        }
      }
    } else {
      for (let i = 0; i < str.length; i++) {
        if ((str[i] >= "0" && str[i] <= "9")) {
          Swal.fire({
            icon: "error",
            title: "",
            text: "ห้ามใส่ตัวเลข",
          });
          this.formStd_code.controls[st].setValue("");
        } else {
        }
      }
    }
  }
}
