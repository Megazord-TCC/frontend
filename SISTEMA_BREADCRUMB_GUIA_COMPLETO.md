# 📚 Sistema de Breadcrumb - Guia Completo

## 🎯 **Visão Geral**

O sistema de breadcrumb foi refatorado para ser simples, lógico e fácil de manter. Ele funciona com uma hierarquia clara entre componentes **PAI** e **FILHO**, onde:

- **Componentes PAI** definem os breadcrumbs base uma única vez
- **Componentes FILHO** simplesmente adicionam seu breadcrumb ao array existente
- A navegação de volta automaticamente limpa os breadcrumbs filhos

## 🏗️ **Arquitetura do Sistema**

### **BreadcrumbService - Métodos Disponíveis**

```typescript
// MÉTODOS PARA COMPONENTES PAI
setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void
removeChildrenAfter(parentUrl: string): void

// MÉTODOS PARA COMPONENTES FILHO
addChildBreadcrumb(childBreadcrumb: BreadcrumbItem): void

// MÉTODOS PARA NAVEGAÇÃO
removeBreadcrumbByUrl(url: string): void
truncateBreadcrumbs(index: number): void

// MÉTODOS UTILITÁRIOS
getCurrentBreadcrumbs(): BreadcrumbItem[]
clearBreadcrumbs(): void
```

## 🚀 **Como Implementar em Novos Componentes**

### **1. COMPONENTE PAI (Nível Principal)**

Componentes que são pontos de entrada ou páginas principais.

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../service/breadcrumb.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-minha-pagina-pai',
  // ... imports
})
export class MinhaPaginaPaiComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    // SEMPRE usar route.paramMap.subscribe para componentes navegáveis
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      // Extrair parâmetros da rota
      const meuId = params.get('id') ? Number(params.get('id')) : 0;

      // COMPONENTE PAI: Definir breadcrumbs base UMA VEZ
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Início', url: '/inicio', isActive: false },
        { label: 'Minha Seção', url: '/minha-secao', isActive: false },
        { label: 'Página Atual', url: `/minha-secao/${meuId}`, isActive: true }
      ]);

      // COMPONENTE PAI: Remover breadcrumbs filhos (somente se necessário)
      const currentBreadcrumbs = this.breadcrumbService.getCurrentBreadcrumbs();
      const expectedLength = 3; // [Início, Minha Seção, Página Atual]
      if (currentBreadcrumbs.length > expectedLength) {
        this.breadcrumbService.removeChildrenAfter(`/minha-secao/${meuId}`);
      }

      // Carregar dados do componente
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    // SEMPRE limpar subscriptions
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadData(): void {
    // Carregar dados da página
  }
}
```

### **2. COMPONENTE FILHO (Nível Secundário)**

Componentes que são páginas de detalhe ou subseções.

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../service/breadcrumb.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-minha-pagina-filho',
  // ... imports
})
export class MinhaPaginaFilhoComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    // SEMPRE usar route.paramMap.subscribe
    this.routeSubscription = this.route.paramMap.subscribe(async params => {
      // Extrair parâmetros
      const paiId = params.get('paiId') ? Number(params.get('paiId')) : 0;
      const filhoId = params.get('filhoId') ? Number(params.get('filhoId')) : 0;

      // Carregar dados primeiro
      await this.loadData(paiId, filhoId);

      // COMPONENTE FILHO: Adicionar breadcrumb apenas DEPOIS de carregar dados
      this.breadcrumbService.addChildBreadcrumb({
        label: this.meuObjeto?.nome || `Item ${filhoId}`,
        url: `/minha-secao/${paiId}/detalhe/${filhoId}`,
        isActive: true
      });
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadData(paiId: number, filhoId: number): Promise<void> {
    // Carregar dados do objeto
    this.meuObjeto = await this.meuService.getById(filhoId);
  }

  goBack(): void {
    // SEMPRE remover o próprio breadcrumb antes de navegar
    this.breadcrumbService.removeBreadcrumbByUrl(`/minha-secao/${this.paiId}/detalhe/${this.filhoId}`);
    this.router.navigate(['/minha-secao', this.paiId]);
  }
}
```

### **3. COMPONENTE NETO (Nível Terciário)**

Componentes que são subdetalhes ou páginas mais profundas.

```typescript
@Component({
  selector: 'app-minha-pagina-neto',
  // ... imports
})
export class MinhaPaginaNetoComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(async params => {
      const paiId = params.get('paiId') ? Number(params.get('paiId')) : 0;
      const filhoId = params.get('filhoId') ? Number(params.get('filhoId')) : 0;
      const netoId = params.get('netoId') ? Number(params.get('netoId')) : 0;

      // Carregar dados primeiro
      await this.loadData(paiId, filhoId, netoId);

      // COMPONENTE NETO: Simplesmente adicionar ao breadcrumb existente
      this.breadcrumbService.addChildBreadcrumb({
        label: this.meuObjetoNeto?.nome || `Subitem ${netoId}`,
        url: `/minha-secao/${paiId}/detalhe/${filhoId}/subdetalhe/${netoId}`,
        isActive: true
      });
    });
  }

  goBack(): void {
    // Remover próprio breadcrumb antes de navegar
    this.breadcrumbService.removeBreadcrumbByUrl(`/minha-secao/${this.paiId}/detalhe/${this.filhoId}/subdetalhe/${this.netoId}`);
    this.router.navigate(['/minha-secao', this.paiId, 'detalhe', this.filhoId]);
  }
}
```

## 🎨 **Template do Breadcrumb**

Adicione o componente breadcrumb em todos os templates:

```html
<!-- Adicionar no início do template -->
<app-breadcrumb></app-breadcrumb>

<!-- Resto do conteúdo da página -->
<div class="page-content">
  <!-- Seu conteúdo aqui -->
</div>
```

## 📋 **Interface BreadcrumbItem**

```typescript
export interface BreadcrumbItem {
  label: string;      // Texto exibido no breadcrumb
  url: string;        // URL para navegação
  isActive: boolean;  // Se é o item ativo (última página)
}
```

## ✅ **Checklist para Novos Componentes**

### **Para COMPONENTES PAI:**
- [ ] Implementar `OnInit` e `OnDestroy`
- [ ] Usar `route.paramMap.subscribe()` (não `snapshot`)
- [ ] Chamar `setBreadcrumbs()` com array completo
- [ ] Chamar `removeChildrenAfter()` quando necessário
- [ ] Limpar subscription no `ngOnDestroy()`

### **Para COMPONENTES FILHO:**
- [ ] Implementar `OnInit` e `OnDestroy`
- [ ] Usar `route.paramMap.subscribe()` (não `snapshot`)
- [ ] Carregar dados ANTES de chamar `addChildBreadcrumb()`
- [ ] Implementar `goBack()` com `removeBreadcrumbByUrl()`
- [ ] Limpar subscription no `ngOnDestroy()`

### **Para TODOS os componentes:**
- [ ] Adicionar `<app-breadcrumb></app-breadcrumb>` no template
- [ ] Importar `BreadcrumbComponent` nos imports do componente
- [ ] Injetar `BreadcrumbService` no constructor

## 🎯 **Padrões e Melhores Práticas**

### **1. Ordem de Operações**
```typescript
ngOnInit() {
  this.routeSubscription = this.route.paramMap.subscribe(async params => {
    // 1. Extrair parâmetros
    // 2. Carregar dados
    // 3. Configurar breadcrumbs (PAI) ou adicionar breadcrumb (FILHO)
  });
}
```

### **2. Nomenclatura de URLs**
```typescript
// ✅ BOM: URLs consistentes e hierárquicas
'/estrategias'
'/estrategia/1'
'/estrategia/1/grupo-criterio/2'
'/estrategia/1/grupo-criterio/2/criterio/3'

// ❌ RUIM: URLs inconsistentes
'/estrategias'
'/estrategia-detail/1'
'/grupo/2'
'/criterio-page/3'
```

### **3. Labels Dinâmicos**
```typescript
// ✅ BOM: Usar nome real do objeto
this.breadcrumbService.addChildBreadcrumb({
  label: this.projeto?.nome || `Projeto ${this.projetoId}`,
  url: `/projeto/${this.projetoId}`,
  isActive: true
});

// ❌ RUIM: Label estático
this.breadcrumbService.addChildBreadcrumb({
  label: 'Detalhes do Projeto',
  url: `/projeto/${this.projetoId}`,
  isActive: true
});
```

### **4. Tratamento de Erros**
```typescript
async loadData(): Promise<void> {
  try {
    this.meuObjeto = await firstValueFrom(this.meuService.getById(this.id));
    
    // Só adicionar breadcrumb se dados carregaram com sucesso
    this.breadcrumbService.addChildBreadcrumb({
      label: this.meuObjeto.nome,
      url: `/minha-secao/${this.id}`,
      isActive: true
    });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    // Breadcrumb com label padrão em caso de erro
    this.breadcrumbService.addChildBreadcrumb({
      label: `Item ${this.id}`,
      url: `/minha-secao/${this.id}`,
      isActive: true
    });
  }
}
```

## 🔧 **Exemplos Práticos do Sistema Atual**

### **Exemplo 1: Páginas de Estratégias**
```
Início → Estratégias → Estratégia 2024 → Grupo de Critério → Critério X
```

**Hierarquia:**
- `strategies-page` (PAI): Define [Início, Estratégias]
- `strategy-detail-page` (PAI): Define [Início, Estratégias, Estratégia 2024]
- `grupo-criterios` (FILHO): Adiciona [Grupo de Critério]
- `criterio` (NETO): Adiciona [Critério X]

### **Exemplo 2: Páginas de Projetos**
```
Início → Projetos → Projeto ABC
```

**Hierarquia:**
- `projectspage` (PAI): Define [Início, Projetos]
- `project-detailpage` (FILHO): Adiciona [Projeto ABC]

## 🚨 **Problemas Comuns e Soluções**

### **Problema 1: Lista desaparece ao voltar**
**Causa:** Usar `route.snapshot.paramMap` em vez de `route.paramMap.subscribe()`
**Solução:** Sempre usar subscription para detectar mudanças na rota

### **Problema 2: Breadcrumbs duplicados**
**Causa:** Chamar `addChildBreadcrumb()` múltiplas vezes
**Solução:** O service já previne duplicação automaticamente

### **Problema 3: Memory leaks**
**Causa:** Não fazer cleanup das subscriptions
**Solução:** Sempre implementar `ngOnDestroy()` e fazer `unsubscribe()`

### **Problema 4: Breadcrumb com label incorreto**
**Causa:** Adicionar breadcrumb antes de carregar os dados
**Solução:** Sempre carregar dados primeiro, depois adicionar breadcrumb

## 📝 **Conclusão**

O sistema de breadcrumb refatorado é:

- ✅ **Simples:** Apenas 2-3 métodos por tipo de componente
- ✅ **Lógico:** Hierarquia clara PAI → FILHO → NETO
- ✅ **Automático:** Remove breadcrumbs filhos automaticamente
- ✅ **Robusto:** Previne duplicação e memory leaks
- ✅ **Escalável:** Fácil de usar em novos componentes

Siga este guia e o sistema de breadcrumb funcionará perfeitamente em qualquer nova página! 🎉
