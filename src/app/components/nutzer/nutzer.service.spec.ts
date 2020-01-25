import { TestBed } from '@angular/core/testing';

import { NutzerService } from './nutzer.service';

describe('NutzerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NutzerService = TestBed.get(NutzerService);
    expect(service).toBeTruthy();
  });
});
