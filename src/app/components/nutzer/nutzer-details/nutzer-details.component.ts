import { Component, OnInit, Input } from '@angular/core';
import { NutzerService } from '../nutzer.service';
import { Nutzer } from '../nutzer';
 
@Component({
  selector: 'app-nutzer-details',
  templateUrl: './nutzer-details.component.html',
  styleUrls: ['./nutzer-details.component.css']
})
export class NutzerDetailsComponent implements OnInit {
 
  @Input() nutzer: Nutzer;
 
  constructor(private nutzerService: NutzerService) { }
 
  ngOnInit() {
  }
 
  updateActive(isActive: boolean) {
    this.nutzerService
      .updateNutzer(this.nutzer.key, { active: isActive })
      .catch(err => console.log(err));
  }
 
  deleteNutzer() {
    this.nutzerService
      .deleteNutzer(this.nutzer.key)
      .catch(err => console.log(err));
  }
 
}
