import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../../models/ui.model';

@Component({
  selector: 'homm-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true,
})
export class ButtonComponent {
  theme = input<Theme>('primary');
  iconLeft = input<string>();
  iconRight = input<string>();
  ariaLabel = input<string>();
  disabled = input<boolean>(false);
}
