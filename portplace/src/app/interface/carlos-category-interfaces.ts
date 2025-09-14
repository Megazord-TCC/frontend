
// Representa a linha da tabela de categorias, da aba 'Categorias' da página
// de um portfólio específico.
export class PortfolioCategoryTableRow {
    id = 0;
    name = '';
}

export class PortfolioCategoryReadDTO {
    id = 0;
    name = '';
    description = '';
    portfolioId = 0; 
    disabled = false;
    createdAt = new Date();
    lastModifiedAt?: Date;
    lastModifiedBy = '';
    createdBy = '';
    canBeDeleted = false;
}