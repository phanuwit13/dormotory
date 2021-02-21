import { HttpService } from "./../../../../services/http.service";
import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import Swal from "sweetalert2";
export interface Fruit {
  name: string;
}

@Component({
  selector: "app-rule-manage",
  templateUrl: "./rule-manage.component.html",
  styleUrls: ["./rule-manage.component.scss"],
})
export class RuleManageComponent implements OnInit {
  public ruleChoice: Array<any> = null;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  readonly separatorKeysCodes: number[] = [ENTER];
  constructor(private http: HttpService) {}

  ngOnInit() {
    this.getRule();
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const str = event.value;
    if (str == "") {
      Swal.fire("ไม่สำเร็จ", "กรุณากรอกข้อมูล", "error");
      return;
    }
    Swal.fire({
      title: "คุณมั่นใจที่จะบันทึกข้อมูล??",
      text: "คุณจะไม่สามารถยกเลิกสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        let check: boolean = await this.setRules(str);

        if (check) {
          Swal.fire("สำเร็จ", "เพิ่มกฎสำเร็จ", "success");
          this.getRule();
        } else {
          Swal.fire("ไม่สำเร็จ", "เพิ่มกฎไม่สำเร็จ", "error");
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    });
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(ruleChoice): void {
    Swal.fire({
      title: "คุณมั่นใจที่จะลบข้อมูล??",
      text: "คุณจะไม่สามารถยกเลิกสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        let check: boolean = await this.delRules(ruleChoice.rules_number);

        if (check == true) {
          Swal.fire("สำเร็จ", "ลบกฎสำเร็จ", "success");
          this.getRule();
        } else {
          Swal.fire("ไม่สำเร็จ", "ลบกฎไม่สำเร็จ", "error");
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    });
  }

  async setRules(rules_name) {
    let formData = new FormData();
    formData.append("rules_name", rules_name);
    formData.forEach((itex) => {
    });
    let httpRespon: any = await this.http.post("setRules", formData);
    if (httpRespon.response.success) {
      return true;
    } else {
      return false;
    }
  }
  async delRules(rules_number) {
    let formData = new FormData();
    formData.append("rules_number", rules_number);
    formData.forEach((itex) => {
    });
    let httpRespon: any = await this.http.post("delRules", formData);
    if (httpRespon.response.success) {
      return true;
    } else {
      return false;
    }
  }
  async getRule() {
    let httpRespon: any = await this.http.post("Rule");
    if (httpRespon.response.data.length > 0) {
      this.ruleChoice = httpRespon.response.data;
      this.ruleChoice = this.ruleChoice.filter((item) => {
        return item.rules_number != 16;
      });
    } else {
      this.ruleChoice = null;
    }
  }
}
