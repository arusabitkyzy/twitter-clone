import { TestBed } from '@angular/core/testing';

import { TweetServices } from './tweet-services';

describe('TweetServices', () => {
  let service: TweetServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
