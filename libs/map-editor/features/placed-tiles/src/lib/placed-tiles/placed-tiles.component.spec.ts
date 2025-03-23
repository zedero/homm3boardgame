import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlacedTilesComponent } from './placed-tiles.component';

describe('PlacedTilesComponent', () => {
  let component: PlacedTilesComponent;
  let fixture: ComponentFixture<PlacedTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacedTilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacedTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
