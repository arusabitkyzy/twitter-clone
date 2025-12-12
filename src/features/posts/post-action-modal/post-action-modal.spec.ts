import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostActionModal } from './post-action-modal';

describe('PostActionModal', () => {
  let component: PostActionModal;
  let fixture: ComponentFixture<PostActionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostActionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostActionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
