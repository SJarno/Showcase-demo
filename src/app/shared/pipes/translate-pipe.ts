import { inject, Pipe, PipeTransform } from '@angular/core';

import { LanguageService } from '../features/language-service/language-service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly localization = inject(LanguageService);

  transform(key: string): string {
    return this.localization.translate(key);
  }
}
