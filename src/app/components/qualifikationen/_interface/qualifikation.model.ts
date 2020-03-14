import { QualifikationDaten } from './qualifikationDaten.model';

export class Qualifikation{
  key: string;
  qualifikationDaten: QualifikationDaten;

  public getBezeichnung() {
    return this.qualifikationDaten.bezeichnung;
  }
}
