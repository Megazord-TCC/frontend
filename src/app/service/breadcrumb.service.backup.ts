import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadcrumbItem } from '../interface/interfacies';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  public breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  /**
   * Inicializa os breadcrumbs com o item "Início"
   */
  initializeBreadcrumbs(): void {
    const initialBreadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Início',
        url: '/inicio',
        isActive: false
      }
    ];
    this.breadcrumbsSubject.next(initialBreadcrumbs);
  }

  /**
   * Define os breadcrumbs completamente
   */
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  /**
   * Adiciona um novo breadcrumb ao final da lista
   */
  addBreadcrumb(item: BreadcrumbItem): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    // Remove o estado ativo do último item
    const updatedBreadcrumbs = currentBreadcrumbs.map(breadcrumb => ({
      ...breadcrumb,
      isActive: false
    }));

    // Adiciona o novo item como ativo
    updatedBreadcrumbs.push({
      ...item,
      isActive: true
    });

    this.breadcrumbsSubject.next(updatedBreadcrumbs);
  }

  /**
   * Obtém os breadcrumbs atuais
   */
  getCurrentBreadcrumbs(): BreadcrumbItem[] {
    return this.breadcrumbsSubject.value;
  }

  /**
   * Obtém os breadcrumbs para passar para um componente filho
   * (todos com isActive = false)
   */
  getBreadcrumbsForChild(): BreadcrumbItem[] {
    return this.breadcrumbsSubject.value.map(breadcrumb => ({
      ...breadcrumb,
      isActive: false
    }));
  }

  /**
   * Remove breadcrumbs a partir de um índice específico
   * Útil para navegação via breadcrumb
   */
  truncateBreadcrumbs(index: number): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    const truncatedBreadcrumbs = currentBreadcrumbs.slice(0, index + 1);

    // Define o último como ativo e os anteriores como inativos
    const updatedBreadcrumbs = truncatedBreadcrumbs.map((breadcrumb, i) => ({
      ...breadcrumb,
      isActive: i === truncatedBreadcrumbs.length - 1
    }));

    this.breadcrumbsSubject.next(updatedBreadcrumbs);
  }

  /**
   * Constrói breadcrumbs para um componente filho baseado nos breadcrumbs atuais
   * Este método deve ser usado por componentes filhos para manter a consistência
   */
  buildChildBreadcrumbs(childBreadcrumb: BreadcrumbItem): void {
    const currentBreadcrumbs = this.getBreadcrumbsForChild();

    // Verificar se o breadcrumb já existe para evitar duplicação
    const existingIndex = currentBreadcrumbs.findIndex(breadcrumb =>
      breadcrumb.url === childBreadcrumb.url
    );

    let updatedBreadcrumbs: BreadcrumbItem[];

    if (existingIndex >= 0) {
      // Se já existe, truncar a partir desse ponto e adicionar o novo
      updatedBreadcrumbs = currentBreadcrumbs.slice(0, existingIndex);
    } else {
      // Se não existe, usar todos os breadcrumbs atuais
      updatedBreadcrumbs = [...currentBreadcrumbs];
    }

    // Adicionar o breadcrumb do componente filho
    updatedBreadcrumbs.push({
      ...childBreadcrumb,
      isActive: true
    });

    this.breadcrumbsSubject.next(updatedBreadcrumbs);
  }

  /**
   * Atualiza um breadcrumb específico por índice
   * Útil para atualizar labels quando dados são carregados assincronamente
   */
  updateBreadcrumb(index: number, updates: Partial<BreadcrumbItem>): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    if (index >= 0 && index < currentBreadcrumbs.length) {
      const updatedBreadcrumbs = currentBreadcrumbs.map((breadcrumb, i) =>
        i === index ? { ...breadcrumb, ...updates } : breadcrumb
      );
      this.breadcrumbsSubject.next(updatedBreadcrumbs);
    }
  }

  /**
   * Remove breadcrumbs duplicados baseados na URL
   * Útil para limpar estado inconsistente
   */
  removeDuplicateBreadcrumbs(): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    const uniqueBreadcrumbs: BreadcrumbItem[] = [];
    const seenUrls = new Set<string>();

    for (const breadcrumb of currentBreadcrumbs) {
      if (!seenUrls.has(breadcrumb.url)) {
        seenUrls.add(breadcrumb.url);
        uniqueBreadcrumbs.push(breadcrumb);
      }
    }

    // Garantir que apenas o último item está ativo
    const updatedBreadcrumbs = uniqueBreadcrumbs.map((breadcrumb, index) => ({
      ...breadcrumb,
      isActive: index === uniqueBreadcrumbs.length - 1
    }));

    this.breadcrumbsSubject.next(updatedBreadcrumbs);
  }

  /**
   * Reconstrói breadcrumbs filho com verificação de pai
   * Mais seguro que buildChildBreadcrumbs para evitar duplicação
   */
  setChildBreadcrumb(childBreadcrumb: BreadcrumbItem, parentUrl?: string): void {
    let currentBreadcrumbs = this.breadcrumbsSubject.value;

    // Se um parentUrl foi fornecido, truncar até esse pai
    if (parentUrl) {
      const parentIndex = currentBreadcrumbs.findIndex(b => b.url === parentUrl);
      if (parentIndex >= 0) {
        currentBreadcrumbs = currentBreadcrumbs.slice(0, parentIndex + 1);
      }
    }

    // Remover todos como ativos
    const baseBreadcrumbs = currentBreadcrumbs.map(b => ({ ...b, isActive: false }));

    // Verificar se o breadcrumb filho já existe
    const childExists = baseBreadcrumbs.some(b => b.url === childBreadcrumb.url);

    if (!childExists) {
      // Adicionar o breadcrumb filho
      baseBreadcrumbs.push({ ...childBreadcrumb, isActive: true });
    } else {
      // Se já existe, apenas marcar o último como ativo
      const updatedBreadcrumbs = baseBreadcrumbs.map((b, index) => ({
        ...b,
        isActive: index === baseBreadcrumbs.length - 1
      }));
      this.breadcrumbsSubject.next(updatedBreadcrumbs);
      return;
    }

    this.breadcrumbsSubject.next(baseBreadcrumbs);
  }

  /**
   * Limpa todos os breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.breadcrumbsSubject.next([]);
  }
}
