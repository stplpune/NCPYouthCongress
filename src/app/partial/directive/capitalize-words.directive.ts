import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizeWords]'
})
export class CapitalizeWordsDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  private capitalizeWords(value: string): string {
    return value.replace(/\b\w/g, (char: string) => char.toUpperCase());
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const original = input.value;
    const formatted = this.capitalizeWords(original);

    if (formatted !== original) {
      input.value = formatted;

      // 🔑 Important: tell Angular formControl about new value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, formatted);
      }

      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
