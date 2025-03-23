import { Component, computed, inject, input } from '@angular/core';
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
  protected image = computed(() => {
    return this.configService.PORTRAITS()[this.id()]?.image ?? '';
  });
}
