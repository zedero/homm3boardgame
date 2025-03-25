import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'homm-button',
  imports: [CommonModule, MatButton],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true,
})
export class ButtonComponent {
  // info about input
  @Input({ required: true }) title: string = '';
  @Output() clicked = new EventEmitter<void>();

  protected buttonClicked() {
    this.clicked.emit();
  }
}
