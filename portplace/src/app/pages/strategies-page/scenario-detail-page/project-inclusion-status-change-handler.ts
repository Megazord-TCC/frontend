import { catchError, Observable, of, throwError } from "rxjs";
import { SelectButtonOptionSelected } from "../../../components/table/table-contracts";
import { ScenarioProject } from "../../../interface/carlos-interfaces";
import { ScenarioRankingStatusEnum } from "../../../interface/carlos-scenario-dtos";
import { ScenarioService } from "../../../service/scenario-service";
import { UserSelectedProjectScenarioStatus } from "./scenario-detail-table-config";

export class ProjectInclusionStatusChangeHandler {
    constructor(
        private strategyId: number,
        private scenarioId: number,
        private scenarioService: ScenarioService
    ) { }

    private sendHttpPutRequestUpdateProjectInclusionStatus(scenarioProjectId: number, newStatus: ScenarioRankingStatusEnum): Observable<void> {
        return this.scenarioService.updateProjectInclusionStatus(this.strategyId, this.scenarioId, scenarioProjectId, newStatus).pipe(
            catchError(err => { 
                console.error('Erro HTTP durante atualização do status de inclusão: ', err);
                return throwError(() => err);
            })
        );
    }

    public tryChangeInclusionStatus(optionSelected: SelectButtonOptionSelected): Observable<void> {
        let scenarioProject = optionSelected.row as ScenarioProject;
        let oldStatus = scenarioProject.inclusionStatus;
        let userAction = optionSelected.value as UserSelectedProjectScenarioStatus;

        switch (`${userAction}${oldStatus}`) {
            case `${UserSelectedProjectScenarioStatus.INCLUDE}${ScenarioRankingStatusEnum.EXCLUDED}`:
                return this.sendHttpPutRequestUpdateProjectInclusionStatus(scenarioProject.scenarioRankingId, ScenarioRankingStatusEnum.MANUALLY_INCLUDED);
            case `${UserSelectedProjectScenarioStatus.INCLUDE}${ScenarioRankingStatusEnum.MANUALLY_EXCLUDED}`:
            case `${UserSelectedProjectScenarioStatus.RESTORE}${ScenarioRankingStatusEnum.MANUALLY_EXCLUDED}`:
                return this.sendHttpPutRequestUpdateProjectInclusionStatus(scenarioProject.scenarioRankingId, ScenarioRankingStatusEnum.INCLUDED);
            case `${UserSelectedProjectScenarioStatus.REMOVE}${ScenarioRankingStatusEnum.INCLUDED}`:
                return this.sendHttpPutRequestUpdateProjectInclusionStatus(scenarioProject.scenarioRankingId, ScenarioRankingStatusEnum.MANUALLY_EXCLUDED);
            case `${UserSelectedProjectScenarioStatus.REMOVE}${ScenarioRankingStatusEnum.MANUALLY_INCLUDED}`:
            case `${UserSelectedProjectScenarioStatus.RESTORE}${ScenarioRankingStatusEnum.MANUALLY_INCLUDED}`:
                return this.sendHttpPutRequestUpdateProjectInclusionStatus(scenarioProject.scenarioRankingId, ScenarioRankingStatusEnum.EXCLUDED);
            default: {
                console.warn(`Ação do usuário inválida. UserSelectedProjectScenarioStatus (ação desejada): ${userAction} / ScenarioRankingStatusEnum (status antigo): ${oldStatus}`);
                return of(undefined);
            }
        }
    }
}