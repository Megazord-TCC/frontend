import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

/**
 * Interface utilizada para quando o backend retorna uma lista paginada.
 *
 * O tipo genérico `T` representa o tipo dos itens retornados na lista.
 * Por exemplo, `User` caso a API retorne uma lista paginada de usuários.
 *
 * Obs: se você não liga para paginação, use apenas a propriedade `content`.
 *
 * @template T Tipo dos elementos da lista.
 * @property {T[]} content Lista de elementos do tipo `T`.
 * 
 * @example
 * // GET no backend para uma lista de grupo de critérios
 * this.http.get<Page<CriteriaGroup>>(url, { headers: this.getHeaders() })
 */
export class Page<T> {
    content: T[] = [];
    pageable = {
        pageNumber: 0,
        pageSize: 0,
        sort: {
            empty: false,
            sorted: true,
            unsorted: false
        },
        offset: 0,
        paged: true,
        unpaged: false
    };
    last = true;
    totalElements = 0;
    totalPages = 0;
    size = 0;
    number = 0;
    sort = {
        empty: false,
        sorted: true,
        unsorted: false
    };
    numberOfElements = 0;
    first = false;
    empty = true;
}

// Representa um parâmetro de query numa URL.
export interface QueryParam {
    name: string;
    value: string;
}

/**
 * O componente que renderiza tabela, TableComponent, utiliza esse tipo
 * para informar a um devido service quais são as configurações
 * de paginação. Ou seja, se é pra retornar as coisas paginadas em ordem
 * decrescente, ascentente, página 11, com filtros, etc.
 * 
 * Atributos com valor `undefined` ou `[]` simbolizam que o parâmetro não existe (o backend definirá
 * um valor default). Por exemplo, se `page` for `undefined`, então o backend
 * utilizará o valor `10`.
 * 
 * extraQueryParams é apenas pra adicionar parâmetros extras de maneira livre.
 */
export class PaginationQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    filterButtonQueryParam?: QueryParam;
    filterTextQueryParam?: QueryParam;
    extraQueryParams: QueryParam[] = [];

    /**
     * Retorna parâmetros (ou seja, os atributos desta classe, `PaginationQueryParams`) 
     * no formato que o método `httpClient.get(url, params)` deseja.
     */
    getParamsInHttpParamsFormat(): HttpParams {
        let params = new HttpParams();

        if (this.page !== undefined)
            params = params.set('page', this.page.toString());

        if (this.size !== undefined)
            params = params.set('size', this.size.toString());

        if (this.sortBy)
            params = params.set('sortBy', this.sortBy);

        if (this.sortDir)
            params = params.set('sortDir', this.sortDir);

        if (this.filterButtonQueryParam)
            params = params.set(this.filterButtonQueryParam.name, this.filterButtonQueryParam.value);

        if (this.filterTextQueryParam)
            params = params.set(this.filterTextQueryParam.name, this.filterTextQueryParam.value);

        this.extraQueryParams.forEach(param => params = params.append(param.name, param.value));

        return params;
    }

    static sortByThisIfNotSortedYet(sortBy: string, queryParams: PaginationQueryParams = new PaginationQueryParams()): PaginationQueryParams {
        if (!queryParams.sortBy) {
            queryParams.sortBy = sortBy;
            queryParams.sortDir = 'asc';
        }
        return queryParams;
    }

    isAnyFilterApplied(): boolean {
        return !!(this.filterButtonQueryParam || this.filterTextQueryParam);
    }
}

/**
 * Métodos que desejam popular uma tabela paginada devem seguir essa interface.
 */
export interface DataRetrievalMethodForTableComponent {
    (queryParams?: PaginationQueryParams): Observable<Page<any>>;
}