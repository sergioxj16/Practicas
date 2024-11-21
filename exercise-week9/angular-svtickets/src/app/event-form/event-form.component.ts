import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { MyEvent } from '../interfaces/my-event';
import { FormsModule, NgForm, EncodeBase64Directive } from '@angular/forms';

@Component({
  selector: 'event-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {
  added = output<MyEvent>();

  newEvent: MyEvent = {
    id: 1,
    title: '',
    description: '',
    date: '',
    image: '',
    price: 0,
  };

  #changeDetector = inject(ChangeDetectorRef);

  addEvent(form: NgForm) {
    this.added.emit({...this.newEvent});
    form.resetForm();
    this.newEvent.image = '';
    this.newEvent.id!++;
  }

  imageToBase64(imgInput: HTMLInputElement) {
    if (!imgInput.files || imgInput.files.length === 0) { return; }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(imgInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.newEvent.image = reader.result as string;
      this.#changeDetector.markForCheck();
    });
  }
}
