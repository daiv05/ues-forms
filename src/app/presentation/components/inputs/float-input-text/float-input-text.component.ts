import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, Input } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ValidatorFn,
} from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FluidModule } from 'primeng/fluid';

import { InputErrorsComponent } from '@components/inputs/input-errors/input-errors.component';

@Component({
  selector: 'c-float-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    FluidModule,
    InputErrorsComponent,
  ],
  templateUrl: './float-input-text.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatInputTextComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'containerClass',
    '[style]': 'containerStyle',
  },
})
export class FloatInputTextComponent implements ControlValueAccessor {
  value: string | null = '';
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  // Input properties
  @Input() id: string = '';
  @Input() type: 'text' | 'email' | 'url' | 'tel' | 'search' | 'number' = 'text'; // Añadido 'number'
  @Input() icon?: string;
  @Input() iconColor?: string;
  @Input() iconClass?: string;
  @Input() iconPosition?: 'left' | 'right';
  @Input() containerClass: string = '';
  @Input() containerStyle?: Record<string, string>;
  @Input() label: string = '';
  @Input() typeLabel: 'label' | 'floatLabel' = 'floatLabel';
  @Input() placeholder: string = '';
  @Input() floatLabelVariant: 'in' | 'on' | 'over' = 'on';
  @Input() labelClass: string = '';
  @Input() inputClass?: string;
  @Input() inputStyle?: Record<string, string>;
  @Input() errorMessageClass: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() variant: 'filled' | 'outlined' = 'filled';
  @Input() size?: 'small' | 'large';
  @Input() formControl!: FormControl;

  required = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  get hasErrors() {
    return this.formControl?.invalid && (this.formControl?.dirty || this.formControl?.touched);
  };

  public writeValue(value: string | null): void {
    this.value = value || '';
  }

  public registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;

    // Filtrar solo números
    if (this.type === 'number') {
      // Permitir solo números entre 1 y 20
      newValue = newValue.replace(/[^0-9]/g, ''); // Solo dígitos
      if (newValue) {
        const num = parseInt(newValue, 10);
        if (isNaN(num) || num < 1) {
          newValue = '';
        } else if (num > 10) {
          newValue = '10';
        } else {
          newValue = num.toString();
        }
      }
    }

    this.value = newValue;
    input.value = newValue; // Actualizar el valor del input
    this.onChange(newValue);
  }

  public onInputBlur(): void {
    this.onTouched();
  }
}
