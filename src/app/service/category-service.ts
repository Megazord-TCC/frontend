import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { PortfolioCategoryReadDTO } from '../interface/carlos-category-interfaces';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private http: HttpClient) { }

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getPortfolioCategoriesUrl(portfolioId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/categories`;
    }

    // GET - Buscar todas categorias de um portfólio
    getAllCategoriesByPortfolioId(portfolioId: number): Observable<PortfolioCategoryReadDTO[]> {
        const url = this.getPortfolioCategoriesUrl(portfolioId);
        let params = new HttpParams().set('size', '100000');

        return this.http.get<Page<PortfolioCategoryReadDTO>>(url, { params })
            .pipe(map(page => page.content));
    }

    // GET - Buscar categorias de um portfólio (com paginação)
    getPortfolioCategoriesPage(portfolioId: number, queryParams?: PaginationQueryParams): Observable<Page<PortfolioCategoryReadDTO>> {
        const url = this.getPortfolioCategoriesUrl(portfolioId);
        queryParams = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams);
        return this.http.get<Page<PortfolioCategoryReadDTO>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
    }

    // GET - Conferir se o nome da categoria já existe. O nome tem que ser exatamente igual e por completo.
    getCategoryByExactName(portfolioId: number, categoryName: string): Observable<PortfolioCategoryReadDTO | undefined> {
        let queryParams = new PaginationQueryParams();
        queryParams.filterTextQueryParam = { name: 'searchQuery', value: categoryName };

        return this.getPortfolioCategoriesPage(portfolioId, queryParams).pipe(
            map(page => page.content as PortfolioCategoryReadDTO[]),
            map(categories => {
                let categoryWithExactName = categories.find(category => category.name == categoryName);
                return !!categoryWithExactName ? categoryWithExactName : undefined;
            })
        );
    }

    // POST - Criar uma nova categoria em um portfólio
    createCategory(portfolioId: number, categoryName: string, categoryDescription: string): Observable<number> {
        const url = this.getPortfolioCategoriesUrl(portfolioId);
        const body = { name: categoryName, description: categoryDescription, portfolioId: portfolioId };
        return this.http.post<{ id: number }>(url, body, { headers: this.getHeaders() })
            .pipe(map(response => response.id));
    }

    // UPDATE - Atualizar dados do cenário (não se refere a dados do ranking/projetos do cenário)
    updateScenario(portfolioId: number, categoryId: number, categoryName: string, categoryDescription: string): Observable<void> {
        const url = `${this.getPortfolioCategoriesUrl(portfolioId)}/${categoryId}`;
        const body = { name: categoryName, description: categoryDescription };
        return this.http.put<void>(url, body, { headers: this.getHeaders() });
    }

    // GET - Busca categoria por ID
    getCategoryById(portfolioId: number, categoryId: number): Observable<PortfolioCategoryReadDTO> {
        const url = `${this.getPortfolioCategoriesUrl(portfolioId)}/${categoryId}`;
        return this.http.get<PortfolioCategoryReadDTO>(url);
    }

    // DELETE - Deletar uma categoria
    deleteCategory(portfolioId: number, categoryId: number): Observable<void> {
        const url = `${this.getPortfolioCategoriesUrl(portfolioId)}/${categoryId}`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }
}
