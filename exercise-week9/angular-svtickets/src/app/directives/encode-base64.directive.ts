import { Directive, output, inject, ElementRef} from '@angular/core';

@Directive({
  selector: 'input[type=file][encodeBase64]',
  standalone: true,
  host: {
    '(change)': 'encodeFile()'
  },
})
export class EncodeBase64Directive {
  encoded = output<string>();
  element = inject<ElementRef<HTMLInputElement>>(ElementRef);

  encodeFile() {
    const fileInput = this.element.nativeElement;
    if (!fileInput.files?.length) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.encoded.emit(reader.result as string);
    });
  }
}