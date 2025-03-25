import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataConfigService } from '@homm3boardgame/config';

@Component({
  selector: 'feature-grid',
  imports: [CommonModule],
  templateUrl: './map-editor.component.html',
  styleUrl: './map-editor.component.css',
})
export class MapEditorComponent {
  constructor(private dataConfigService: DataConfigService) {
    console.log('test');
    console.log(dataConfigService.TILES);
  }
}
