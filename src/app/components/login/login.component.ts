import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  public userLogin: any = null;
  private oldPath: string = "/nav";
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.userLogin = JSON.parse(window.localStorage.getItem("userlogin"));
  }
  //แบบสั้น
  public onSubmitLogin = async () => {
    window.localStorage.clear();
    this.userLogin = null;
    let formData = new FormData();
    //วนลูบเก็บค่า key และ value

    Object.keys(this.formLogin.value).forEach((key) => {
      //console.log(this.formLogin.value[key]);
      formData.append(key, this.formLogin.value[key]);
    });
    let httpRespon: any = await this.http.post("login", formData);
    console.log(httpRespon);
    if (httpRespon.connect) {
      if (httpRespon.response.success) {
        //this.router.navigate(["/home"]);
        await Swal.fire(httpRespon.response.message, "", "success");
        this.http.navRouter(this.oldPath);
        window.localStorage.setItem(
          "userLogin",
          JSON.stringify(httpRespon.response.data)
        );
        this.userLogin = JSON.parse(window.localStorage.getItem("userLogin"));
        //alert(httpRespon.response.message);
      } else {
        Swal.fire(httpRespon.response.message, "", "error");
      }
    } else {
      Swal.fire("เชื่อมต่อเซิร์ฟเวอร์ผิดพลาด", "", "warning");
    }
  };

  //ยาว
  /*public onSubmitLogin = () => {
    let formData = new FormData();

    //วนลูบเก็บค่า key และ value
    Object.keys(this.formLogin.value).forEach(key => {
      //console.log(this.formLogin.value[key]);
      formData.append(key, this.formLogin.value[key]);
    });
    this.http.post("login", formData).then(value => {
      console.log(value);
    });
  };*/
}
