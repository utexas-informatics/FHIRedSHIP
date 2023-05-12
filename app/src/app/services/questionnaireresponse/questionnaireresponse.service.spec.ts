import { TestBed } from '@angular/core/testing';

import { QuestionnaireresponseService } from './questionnaireresponse.service';

describe('QuestionnaireresponseService', () => {
  let service: QuestionnaireresponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionnaireresponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
