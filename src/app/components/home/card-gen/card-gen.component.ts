import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-card-gen",
  templateUrl: "./card-gen.component.html",
  styleUrls: ["./card-gen.component.scss"],
})
export class CardGenComponent implements OnInit {
  public dataUser: Array<any> = null;

  constructor() {}

  async ngOnInit() {
    this.dataUser = await JSON.parse(window.localStorage.getItem("userData"));
    window.localStorage.removeItem("userData");
    console.log(this.dataUser);
  }
  printData = async () => {
    window.print();
  };
}
