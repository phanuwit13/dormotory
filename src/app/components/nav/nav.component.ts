import Swal from "sweetalert2";
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MediaMatcher } from "@angular/cdk/layout";
import { HttpService } from "src/app/services/http.service";
@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  mobileQuery: MediaQueryList;
  public formLogin: FormGroup;
  private oldPath: string = "/login";
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private http: HttpService,
    private formBuilder: FormBuilder
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      passwordOld: ["", Validators.required],
      passwordNew1: ["", Validators.required],
      passwordNew2: ["", Validators.required],
    });
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logOut = async () => {
    Swal.fire({
      title: "",
      text: "ยืนยันการออกจากระบบ ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        await window.localStorage.clear();
        this.http.navRouter(this.oldPath);
      } else {
      }
    });
  };

  changePassword = async () => {
    Swal.fire({
      title: "",
      text: "ยืนยันการเปลี่ยนรหัสผ่าน ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        if (
          this.formLogin.value["passwordNew1"] ==
          this.formLogin.value["passwordNew2"]
        ) {
          if (
            this.formLogin.value["passwordNew1"] ==
            this.formLogin.value["passwordOld"]
          ) {
            await Swal.fire(
              "",
              "รหัสผ่านเดิมกับรหัสผ่านใหม่เหมือนกัน",
              "error"
            );
          } else {
            console.log("เท่ากัน");
            let formData = new FormData();
            formData.append("password", this.formLogin.value["passwordOld"]);
            formData.append(
              "passwordNew",
              this.formLogin.value["passwordNew1"]
            );
            let httpRespon: any = await this.http.post("changePass", formData);

            if (httpRespon.response.success) {
              document.getElementById("closeModalPass").click();
              this.clearFormInsert()
              await Swal.fire("", httpRespon.response.message, "success");
            } else {
              await Swal.fire("", httpRespon.response.message, "error");
            }
          }
        }
      } else {
        await Swal.fire("", "รหัสผ่านใหม่ไม่ตรงกัน", "error");
      }
    });
  };
  clearFormInsert() {
    Object.keys(this.formLogin.value).forEach((key) => {
      this.formLogin.controls[key].setValue("");
    });
  }
  rout(path) {
    this.http.navRouter("/nav/" + path);
  }
}
