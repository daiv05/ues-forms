import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Store } from '@ngrx/store';

import { NgxSonnerToaster } from 'ngx-sonner';

import { changeAppColors } from '@utils/color-palette';
import { colorPaletteMap } from '@utils/color-palette-map';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'plantilla-angular';
  store = inject(Store);

  toastTheme: 'light' | 'dark' = 'light';

  constructor() {
    this.setColors();
    this.store.select('session').subscribe((session) => {
      if (session.darkMode) {
        this.toastTheme = 'dark';
      }
      else {
        this.toastTheme = 'light';
      }
    });
  }

  setColors() {
    // Verificar si existe la paleta de colores en el localStorage
    if (!localStorage.getItem('color-palette')) {
      localStorage.setItem('color-palette', JSON.stringify(colorPaletteMap));
      console.warn("Palette added to local storage");
    }

    // Asignar los colores primarios del local storage a la paleta de colores si exite en el localStorage
    const colorPaletteFromLocalStorage = JSON.parse((localStorage.getItem('color-palette') as string));
    if (colorPaletteFromLocalStorage) {
      // Asignar los colores de la aplicación (hook que exporta el uso de los hexadecimales)
      changeAppColors(colorPaletteFromLocalStorage);

      // Asignar los colores de la aplicación a las variables CSS de tailwindcss
      Object.keys(colorPaletteMap).forEach((palette) => {
        Object.keys(colorPaletteFromLocalStorage[palette]).forEach((key: string) => {
          document.documentElement.style.setProperty(`--${palette}-${key}`, colorPaletteFromLocalStorage[palette][key]);
        });
      });
    }
  }
}
