import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetDetails } from './tweet-details';

describe('TweetDetails', () => {
  let component: TweetDetails;
  let fixture: ComponentFixture<TweetDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TweetDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TweetDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
