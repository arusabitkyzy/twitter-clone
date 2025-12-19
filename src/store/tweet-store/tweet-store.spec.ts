import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetStore } from './tweet-store';

describe('TweetStore', () => {
  let component: TweetStore;
  let fixture: ComponentFixture<TweetStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TweetStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TweetStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
