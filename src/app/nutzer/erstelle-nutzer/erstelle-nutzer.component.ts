import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
 
import { Nutzer } from '../nutzer';
import { NutzerService } from '../nutzer.service';
 
@Component({
  selector: 'app-erstelle-nutzer',
  templateUrl: './erstelle-nutzer.component.html',
  styleUrls: ['./erstelle-nutzer.component.css']
})
export class ErstelleNutzerComponent implements OnInit {
 
  nutzer: Nutzer = new Nutzer();
  submitted = false;
 
  constructor(private nutzerService: NutzerService) { }
 
  ngOnInit() {
  }
 
  newNutzer(): void {
    this.submitted = false;
    this.nutzer = new Nutzer();
  }
 
  save() {
    this.nutzerService.createNutzer(this.nutzer);
    this.nutzer = new Nutzer();
  }
 
  onSubmit() {
    this.submitted = true;
    this.save();
  }
 
}
