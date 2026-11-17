import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactFormComponent } from './features/contact-form/components/contact-form/contact-form';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Language } from './shared/features/language-service/models';
import { LanguageService } from './shared/features/language-service/language-service';
import { TranslatePipe } from './shared/pipes/translate-pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  imports: [RouterOutlet, ContactFormComponent, MatButtonModule, MatMenuModule, MatIconModule, TranslatePipe, MatProgressBarModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Nordea demo');

  protected readonly localization = inject(LanguageService);

  public changeLanguage(language: Language): void {
    void this.localization.setLanguage(language);
  }
}
