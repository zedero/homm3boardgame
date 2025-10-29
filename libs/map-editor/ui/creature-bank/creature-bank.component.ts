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

  visible = computed(() => {
    return this.id() !== '';
  });
}
