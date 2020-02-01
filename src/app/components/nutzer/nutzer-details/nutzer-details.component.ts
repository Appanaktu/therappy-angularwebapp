import { Component, OnInit, Input } from '@angular/core';
import { NutzerService } from '../../../services/nutzer.service';
import { Nutzer } from '../nutzer';
import { MatCardModule} from '@angular/material';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nutzer-details',
  templateUrl: './nutzer-details.component.html',
  styleUrls: ['./nutzer-details.component.css']
})
export class NutzerDetailsComponent implements OnInit {

  public nutzer: Nutzer;

  @Input () key: string;

  constructor(private nutzerService: NutzerService ) { }

  ngOnInit() {
    this.getNutzer();
  }

  getNutzer() {
    this.nutzerService.getNutzer(this.key).snapshotChanges().pipe(
      map(action => {
          const data = action.payload.data() as any;
          const id = action.payload.id;
          return { id, ...data };
      })
    ).subscribe(res => {
      this.nutzer = res as Nutzer;
    });
  }

  updateActive(isActive: boolean) {
    this.nutzerService
      .updateNutzer(this.nutzer.key, { active: isActive })
      .catch(err => console.log(err));
  }

}
