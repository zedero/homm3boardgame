import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-location',
  imports: [CommonModule],
  templateUrl: './map-location.component.html',
  styleUrl: './map-location.component.scss',
})
export class MapLocationComponent {
  id = input.required<string>();
  rotation = input<number>(0);

  protected rotate = computed(() => {
    const baseRotation = this.id().startsWith('whirlpool-') ? 30 : 0;
    return baseRotation + this.rotation() * 60 + 'deg';
  });

  visible = computed(() => this.id() !== '');
}
