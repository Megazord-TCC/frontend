import { Page } from "../models/pagination-models";
import { PortfolioCategoryReadDTO, PortfolioCategoryTableRow } from "../interface/carlos-category-interfaces";

export function mapPortfolioCategoryReadDTOToPortfolioCategoryTableRow(dto: PortfolioCategoryReadDTO): PortfolioCategoryTableRow {
    const row = new PortfolioCategoryTableRow();
    row.id = dto.id;
    row.name = dto.name;
    return row;
}

export function mapPortfolioCategoryReadDTOPageToPortfolioCategoryTableRowPage(
    categoryPage: Page<PortfolioCategoryReadDTO>
): Page<PortfolioCategoryTableRow> {
    return {
        ...categoryPage,
        content: categoryPage.content.map(mapPortfolioCategoryReadDTOToPortfolioCategoryTableRow)
    };
}