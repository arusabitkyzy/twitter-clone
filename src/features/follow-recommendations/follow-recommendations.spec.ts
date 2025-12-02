import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowRecommendations } from './follow-recommendations';

describe('FollowRecommendations', () => {
  let component: FollowRecommendations;
  let fixture: ComponentFixture<FollowRecommendations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowRecommendations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowRecommendations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
