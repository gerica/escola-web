// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Importe as funções do Apollo Client para mensagens de desenvolvimento
// Certifique-se de ter @apollo/client instalado: npm install @apollo/client
// E se estiver usando TypeScript, pode precisar de @types/apollo__client/dev (ou similar)
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { environment } from './environment';

// Condiciona o carregamento das mensagens ao ambiente de desenvolvimento
if (!environment.production) {
  // Adiciona mensagens apenas em um ambiente de desenvolvimento
  loadDevMessages();
  loadErrorMessages();
  console.log('Apollo Client: Mensagens de desenvolvimento e erro carregadas.');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));