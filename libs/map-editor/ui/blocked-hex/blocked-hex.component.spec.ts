import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockedHexComponent } from './blocked-hex.component';

describe('BlockedHexComponent', () => {
  let component: BlockedHexComponent;
  let fixture: ComponentFixture<BlockedHexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockedHexComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockedHexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
