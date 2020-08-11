import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-save-rule",
  templateUrl: "./rule-save.component.html",
  styleUrls: ["./rule-save.component.scss"],
})
export class RuleSaveComponent implements OnInit {
  constructor(private http: HttpService) {}
  async ngOnInit() {}
}
