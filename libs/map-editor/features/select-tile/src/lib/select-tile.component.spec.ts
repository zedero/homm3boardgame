import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectTileComponent } from './select-tile.component';

describe('SelectTileComponent', () => {
  let component: SelectTileComponent;
  let fixture: ComponentFixture<SelectTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
