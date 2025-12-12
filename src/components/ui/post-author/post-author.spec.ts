import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAuthor } from './post-author';

describe('PostAuthor', () => {
  let component: PostAuthor;
  let fixture: ComponentFixture<PostAuthor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostAuthor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAuthor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
