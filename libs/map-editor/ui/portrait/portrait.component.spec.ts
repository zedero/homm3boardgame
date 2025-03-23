import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortraitComponent } from './portrait.component';

describe('PortraitComponent', () => {
  let component: PortraitComponent;
  let fixture: ComponentFixture<PortraitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortraitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PortraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
