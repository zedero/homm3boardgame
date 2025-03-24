import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapEditorComponent } from './map-editor.component';

describe('MapEditorComponent', () => {
  let component: MapEditorComponent;
  let fixture: ComponentFixture<MapEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
