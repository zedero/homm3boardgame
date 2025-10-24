import { Component, computed, inject, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataConfigService } from '@homm3boardgame/config';

@Component({
  selector: 'app-portrait',
  imports: [CommonModule],
  templateUrl: './portrait.component.html',
  styleUrl: './portrait.component.scss',
})
export class PortraitComponent {
  private configService = inject(DataConfigService);
  id = input.required<string>();
  rotation = input<number>();
  protected image = computed(() => {
    return this.configService.PORTRAITS()[this.id()]?.image ?? '';
  });
  protected rotate: Signal<string> = computed(() => {
    return -(this.rotation() ?? 0) * 60 + 'deg';
  });
}
