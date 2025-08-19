import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Strategy } from '../interface/interfacies';

@Injectable({
  providedIn: 'root'
})
export class EstrategiaService {

  constructor() { }


  getStrategyById(id: number): Observable<Strategy> {
    return of({
      id: '1',
      name: 'Estratégia 2024',
      activeObjectives: 1,
      status: 'ATIVO',
      statusColor: 'green'
    });
  }
}
