import { QueryParam } from "../../models/pagination-models";

/**
 * Configuração de filtros.
 *
 * @property `label` Rótulo do campo de filtro ou do botão de filtro.
 * @property `queryParam` Parâmetro de query que será utilizado na URL para filtrar os dados.
 * Importante: o atributo `name` e `value`do parâmetro de query deve ser exatamente igual ao que o backend espera.
 * Ex: `{ name: 'status', value: 'AUTHORIZED' }`
 */
export class InputFilter {
    label = '';
    queryParam: QueryParam = { name: '', value: '' };
}

export class SelectButton {
    selectOptions: { name: string, value: string }[] = [];
}

/**
 * Configuração de badge (efeito visual chamativo) para os valores numa coluna da tabela.
 *
 * @property `color` Cor de fundo da badge aceita pelo BadgeComponent. Ex: 'blue', 'yellow'...
 * @property `triggeringValues` Valores que, quando encontrados na célula da tabela, ativam esta configuração de badge
 * (ou seja, faz aparecer a badge com a cor desta configuração). Ex: `['0', '1', '2']` ou `['AUTORIZADO', 'CANCELADO']`
 */
export class BadgeConfiguration {
    color = 'blue';
    triggeringValues: string[] = [];
}

/**
 * Configuração do botão de ação (cadastrar, autorizar cenário, etc) que fica no canto superior esquerdo da tabela.
 *
 * @property `label` Rótulo do botão.
 * @property `hasIcon` Define se o botão terá um ícone.
 * @property `iconPath` Caminho do ícone (SVG) que aparecerá no botão.
 */
export class ActionButton {
    label = 'Cadastrar';
    hasIcon = true;
    iconPath = 'assets/icon/cadastrar_vetor.svg';
}

/**
 * Configuração de cada coluna da tabela.
 *
 * @property `label` Rótulo da coluna.
 * @property `order` Ordem da coluna na tabela (1 = primeira coluna, 2 = segunda coluna, etc).
 * @property `isSortable` Define se a coluna pode ser ordenada (clicando no cabeçalho da coluna).
 * @property `frontendAttributeName` Nome do atributo do objeto que popula a tabela (ou seja, o nome do atributo
 * do objeto que está no array `Page.content`). Ex: 'name', 'status', 'budget'...
 * @property `backendAttributeName` Nome do atributo que o backend espera para ordenar esta coluna.
 * Ex: 'name', 'status', 'budget'...
 * @property `isClickableMainColumn` Define se a coluna é a "coluna principal" (ou seja, a coluna que, quando clicada,
 * emite um evento `mainColumnRowClick`, que os componentes que usam o `TableComponent` podem utilizar encaminhar o
 * usuário para a página de detalhes do item da linha, ou para exibir uma modal). Cuidado: Apenas uma coluna deve ter essa propriedade como `true`.
 * @property `selectButton` Configuração do select (dropdown) para caso essa coluna permita que o usuário selecione algo em cada linha da tabela.
 * @property `badgeConfiguration` Configuração das badges que podem aparecer nas células desta coluna.
 * Se esse array estiver vazio, então não aparecerá nenhuma badge nas células desta coluna.
 */
export class TableColumn {
    label = '';
    order = 0;
    isSortable = false;
    frontendAttributeName = '';
    backendAttributeName = '';
    isClickableMainColumn = false;
    selectButton?: SelectButton;
    badgeConfiguration: BadgeConfiguration[] = [];
    formatter?: (value: any, row?: any) => string;
}


/**
 * Interface que representa a coluna que está atualmente sendo utilizada para ordenar a tabela.
 * Este objeto deve ser preenchido somente se o usuário tiver clicado pra ordenar alguma coluna.
 *
 * @property `frontendAttributeName` Nome do atributo do objeto que popula a tabela (ou seja, o nome do atributo
 * do objeto que está no array `Page.content`). Ex: 'name', 'status', 'budget'...
 * @property `sortDir` Direção da ordenação: 'asc' para ascendente, 'desc' para descendente.
 */
export interface CurrentlySortedColumn {
    frontendAttributeName : string;
    sortDir: 'asc' | 'desc';
}
