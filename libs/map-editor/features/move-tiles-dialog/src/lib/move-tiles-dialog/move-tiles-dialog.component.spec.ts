import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveTilesDialogComponent } from './move-tiles-dialog.component';

describe('MoveTilesDialogComponent', () => {
  let component: MoveTilesDialogComponent;
  let fixture: ComponentFixture<MoveTilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveTilesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveTilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
