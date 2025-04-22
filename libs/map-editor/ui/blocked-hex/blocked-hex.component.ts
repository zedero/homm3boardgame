import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blocked-hex',
  imports: [CommonModule],
  templateUrl: './blocked-hex.component.html',
  styleUrl: './blocked-hex.component.scss',
})
export class BlockedHexComponent {
  visible = input.required<boolean>();
}
