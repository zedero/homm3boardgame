import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTileDialogComponent } from './edit-tile-dialog.component';

describe('EditTileDialogComponent', () => {
  let component: EditTileDialogComponent;
  let fixture: ComponentFixture<EditTileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTileDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
