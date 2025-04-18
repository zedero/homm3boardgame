import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isNumber } from '@ngrx/store/src/meta-reducers/utils';

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

  change = output<number>();

  onChange(event: any) {
    const value = event.target.value;
    if (isNumber(value) && !isNaN(value)) {
      this.change.emit(value);
    }
  }
}
