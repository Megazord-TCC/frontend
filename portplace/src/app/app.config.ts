import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Essa Hydration está dando problema no TableComponent:
    // - Não está exibindo o valor dos <select> dentro da tabela (usado na página de Cenário).
    // - Para corrigir isso, notei que posso colocar um setTimeout de 5s lá no TableComponent,
    // na chamada do método sendHttpGetRequestAndPopulateTable() que fica no ngOnInit().
    // Mas, preferi comentar a linha abaixo, porque setTimeout é gambiarra.
    // provideClientHydration(withEventReplay()),
    
    provideHttpClient(withFetch())
  ]
};
