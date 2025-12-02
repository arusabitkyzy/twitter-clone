import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideModal } from './side-modal';

describe('SideModal', () => {
  let component: SideModal;
  let fixture: ComponentFixture<SideModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
