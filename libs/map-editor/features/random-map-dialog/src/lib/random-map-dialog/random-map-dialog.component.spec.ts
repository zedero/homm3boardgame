import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RandomMapDialogComponent } from './random-map-dialog.component';

describe('RandomMapDialogComponent', () => {
  let component: RandomMapDialogComponent;
  let fixture: ComponentFixture<RandomMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomMapDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
