import { catchError, Observable, throwError } from "rxjs";
import { SelectButtonOptionSelected } from "../../../components/table/table-contracts";
import { ScenarioProject } from "../../../interface/carlos-interfaces";
import { ScenarioRankingStatusEnum } from "../../../interface/carlos-scenario-dtos";
import { ScenarioService } from "../../../service/scenario-service";

export class ProjectCategoryChangeHandler {
    constructor(
        private strategyId: number,
        private scenarioId: number,
        private scenarioService: ScenarioService
    ) { }

    private sendHttpRequestUpdateProjectCategory(
        scenarioProjectId: number, 
        currentStatus: ScenarioRankingStatusEnum, // Não era pra ter que informar, mas o UPDATE atualiza o atributo status, então temos que informar o status atual pra ele não ser removido
        newCategoryId: number
    ): Observable<void> {
        return this.scenarioService.updateScenarioProject(
            this.strategyId, 
            this.scenarioId, 
            scenarioProjectId, 
            currentStatus, 
            newCategoryId
        ).pipe(
            catchError(err => { 
                console.error('Erro HTTP durante atualização da categoria de projeto: ', err);
                return throwError(() => err);
            })
        );
    }

    public changeCategory(optionSelected: SelectButtonOptionSelected): Observable<void> {
        let scenarioProject = optionSelected.row as ScenarioProject;
        let newCategoryId = Number(optionSelected.value);

        return this.sendHttpRequestUpdateProjectCategory(
            scenarioProject.scenarioRankingId,
            scenarioProject.inclusionStatus as ScenarioRankingStatusEnum,
            newCategoryId 
        );
    }
}