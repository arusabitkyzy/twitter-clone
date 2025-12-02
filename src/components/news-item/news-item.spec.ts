import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsItem } from './news-item';

describe('NewsItem', () => {
  let component: NewsItem;
  let fixture: ComponentFixture<NewsItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
