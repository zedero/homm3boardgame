import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'homm-number-input',
  imports: [CommonModule],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
})
export class NumberInputComponent {
  placeholder = input<string>();
  labelLeft = input<string>();
  labelRight = input<string>();
  value = input.required<number>();

  @Output() valueChange = new EventEmitter<number>();

  onChange(event: any) {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      this.valueChange.emit(value);
    }
  }
}
