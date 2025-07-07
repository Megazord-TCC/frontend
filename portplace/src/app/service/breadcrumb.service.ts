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
   * MÉTODO PAI: Define os breadcrumbs base (usado apenas por componentes principais)
   * Componentes pai chamam isso UMA VEZ para configurar os breadcrumbs base
   */
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  /**
   * MÉTODO FILHO: Adiciona breadcrumb filho ao array existente do pai
   * O filho simplesmente adiciona o seu breadcrumb ao que já existe
   * Não reconstrói nada, apenas adiciona
   */
  addChildBreadcrumb(childBreadcrumb: BreadcrumbItem): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    // Verificar se já existe para evitar duplicação
    const exists = currentBreadcrumbs.some(b => b.url === childBreadcrumb.url);
    if (exists) {
      return; // Não adicionar se já existe
    }

    // Marcar todos como inativos
    const updatedBreadcrumbs = currentBreadcrumbs.map(b => ({ ...b, isActive: false }));

    // Adicionar o breadcrumb filho como ativo
    updatedBreadcrumbs.push({ ...childBreadcrumb, isActive: true });

    this.breadcrumbsSubject.next(updatedBreadcrumbs);
  }

  /**
   * MÉTODO PAI: Remove breadcrumbs filhos quando pai volta ao foco
   * O pai chama isso no ngOnInit para limpar breadcrumbs de componentes filhos
   */
  removeChildrenAfter(parentUrl: string): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;

    // Se não há breadcrumbs, não fazer nada
    if (currentBreadcrumbs.length === 0) {
      return;
    }

    const parentIndex = currentBreadcrumbs.findIndex(b => b.url === parentUrl);

    if (parentIndex >= 0) {
      // Manter apenas até o pai (inclusive)
      const trimmedBreadcrumbs = currentBreadcrumbs.slice(0, parentIndex + 1);

      // Marcar o pai como ativo novamente
      const updatedBreadcrumbs = trimmedBreadcrumbs.map((b, index) => ({
        ...b,
        isActive: index === trimmedBreadcrumbs.length - 1
      }));

      this.breadcrumbsSubject.next(updatedBreadcrumbs);
    }
  }

  /**
   * Navegação via breadcrumb - trunca automaticamente
   */
  truncateBreadcrumbs(index: number): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    const truncatedBreadcrumbs = currentBreadcrumbs.slice(0, index + 1);

    const updatedBreadcrumbs = truncatedBreadcrumbs.map((breadcrumb, i) => ({
      ...breadcrumb,
      isActive: i === truncatedBreadcrumbs.length - 1
    }));

    this.breadcrumbsSubject.next(updatedBreadcrumbs);
  }

  /**
   * Obtém os breadcrumbs atuais
   */
  getCurrentBreadcrumbs(): BreadcrumbItem[] {
    return this.breadcrumbsSubject.value;
  }

  /**
   * Limpa todos os breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.breadcrumbsSubject.next([]);
  }

  /**
   * Inicializa breadcrumbs vazios (compatibilidade)
   */
  initializeBreadcrumbs(): void {
    this.clearBreadcrumbs();
  }

  /**
   * Remove breadcrumb específico por URL (para usar no goBack)
   */
  removeBreadcrumbByUrl(url: string): void {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    const targetIndex = currentBreadcrumbs.findIndex(b => b.url === url);

    if (targetIndex >= 0) {
      // Manter apenas até antes do breadcrumb alvo
      const trimmedBreadcrumbs = currentBreadcrumbs.slice(0, targetIndex);

      // Se ainda há breadcrumbs, marcar o último como ativo
      if (trimmedBreadcrumbs.length > 0) {
        const updatedBreadcrumbs = trimmedBreadcrumbs.map((b, index) => ({
          ...b,
          isActive: index === trimmedBreadcrumbs.length - 1
        }));
        this.breadcrumbsSubject.next(updatedBreadcrumbs);
      } else {
        this.clearBreadcrumbs();
      }
    }
  }
}
