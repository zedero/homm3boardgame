import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'homm-checkbox',
  imports: [CommonModule, MatCheckbox],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  label = input.required<string>();
  checked = input<boolean>(false);
  @Output() public checkedChange: EventEmitter<boolean> = new EventEmitter();

  onChange(event: any) {
    this.checkedChange.emit(event.checked);
  }
}
