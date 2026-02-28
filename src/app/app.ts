import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationPanel } from "./navigation-panel/navigation-panel";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationPanel],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lab1front');
}
