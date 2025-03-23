import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cube',
  imports: [CommonModule],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.scss',
  standalone: true,
})
export class CubeComponent {
  id = input.required<number>();
  protected cubeClass = computed(() => {
    return 'color-' + this.id();
  });
}
