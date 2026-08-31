import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creature-bank',
  imports: [CommonModule],
  templateUrl: './creature-bank.component.html',
  styleUrl: './creature-bank.component.scss',
})
export class CreatureBankComponent {
  id = input.required<string>();
  rotation = input<number>(0);
  protected rotate = computed(() => this.rotation() * 60 + 'deg');

  visible = computed(() => {
    return this.id() !== '';
  });
}
