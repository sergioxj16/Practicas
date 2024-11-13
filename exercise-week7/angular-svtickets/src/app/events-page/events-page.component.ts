import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MyEvent } from '../intefaces/my-event';

@Component({
  selector: 'events-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css']
})

export class EventsPageComponent {
  events: MyEvent[] = [];
  nextId = 1;
  
  newEvent: MyEvent = {
    title: "",
    description: "",
    price: 0,
    image: "",
    date: ""
  };

  constructor() {
    this.resetEvent();
  }
  
  private resetEvent(): void {
    this.newEvent = {
      title: "",
      description: "",
      price: 0,
      image: "",
      date: ""
    };
  }

  addEvent(eventForm: NgForm): void {
    this.newEvent.id = this.nextId;
    this.events.push({ ...this.newEvent });
    this.nextId++;
  
    eventForm.resetForm();
    this.newEvent.image = '';
  }
  
  deleteButton(index: number): void {
    this.events.splice(index, 1);
  }

  changeImage(fileInput: HTMLInputElement): void {
    if (!fileInput.files || fileInput.files.length === 0) return;

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.newEvent.image = reader.result as string;
    });
  }
}
