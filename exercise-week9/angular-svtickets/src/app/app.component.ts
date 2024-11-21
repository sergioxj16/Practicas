import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventsPageComponent } from './events-page/events-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EventsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SVTickets';
}
