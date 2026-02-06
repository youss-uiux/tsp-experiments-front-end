import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TSPViewerComponent } from './components/tsp-viewer/tsp-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TSPViewerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tsp');
}
