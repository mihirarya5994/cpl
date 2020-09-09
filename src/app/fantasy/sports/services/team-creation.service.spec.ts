/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TeamCreationService } from './team-creation.service';

describe('Service: MyTeams', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamCreationService]
    });
  });

  it('should ...', inject([TeamCreationService], (service: TeamCreationService) => {
    expect(service).toBeTruthy();
  }));
});
