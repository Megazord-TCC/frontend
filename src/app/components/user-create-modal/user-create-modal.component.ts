import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../interface/carlos-auth-interfaces';
import { UserService } from '../../service/user-service';
import { fromRoleToRoleDTO, mapRoleToDescription } from '../../mappers/auth-mapper';
import { UserStatusEnumDTO } from '../../interface/carlos-user-interfaces';

@Component({
    selector: 'app-user-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './user-create-modal.component.html',
    styleUrl: './user-create-modal.component.scss'
})
export class UserCreateModalComponent {
    @Output() userCreate = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    userService = inject(UserService);

    inputName = '';
    inputEmail = '';
    inputPassword = '';
    inputRoleSelected = Role.DIRECTOR.toString();
    inputIsUserActive = true;

    inputRoleOptions = [Role.PMO, Role.PMO_ADM, Role.PROJECT_MANAGER, Role.DIRECTOR].sort((a, b) => a.localeCompare(b));

    errorMessage = '';

    isSubmitButtonDisabled = false;

    mouseDownOnOverlay = false;

    ngOnInit() {
        this.clearForm();
    }

    getRoleDescription(): string {
        return mapRoleToDescription(this.inputRoleSelected as Role);
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay)
            this.close.emit();

        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
    }

    async onSave(): Promise<any> {
        let isFormValid = await this.isFormValid();
        if (!isFormValid) return;

        let role = fromRoleToRoleDTO(this.inputRoleSelected as Role);
        if (!role) return;

        let status = this.inputIsUserActive ? UserStatusEnumDTO.ACTIVE : UserStatusEnumDTO.INACTIVE

        this.userService.createUser(this.inputName, this.inputEmail, this.inputPassword, role, status).subscribe({
            next: _ => this.userCreate.emit(),
            error: (err: HttpErrorResponse) => {
                if (err.status === 409) this.errorMessage = 'E-mail já cadastrado.';
                else this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
            },
        });
    }

    clearForm() {
        this.inputName = '';
        this.inputEmail = '';
        this.inputPassword = '';
        this.inputRoleSelected = Role.DIRECTOR.toString();
        this.inputIsUserActive = true;
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }

    async isFormValid(): Promise<boolean> {
        return this.isNameFilled()
            && this.isEmailValid()
            && this.isPasswordValid();
    }

    isNameFilled(): boolean {
        let isNameFilled = !!this.inputName.trim();

        this.errorMessage = isNameFilled ? '' : 'Os campos marcados com * são obrigatórios.';

        return isNameFilled;
    }

    isEmailValid(): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = regex.test(this.inputEmail);

        if (!isValid) this.errorMessage = 'Por favor, insira um e-mail válido.';

        return isValid;
    }

    isPasswordValid(): boolean {
        return this.isPasswordFilled() && this.isPasswordSizeValid();
    }

    isPasswordFilled(): boolean {
        let isPasswordFilled = !!this.inputPassword.trim();

        this.errorMessage = isPasswordFilled ? '' : 'Os campos marcados com * são obrigatórios.';

        return isPasswordFilled;
    }

    isPasswordSizeValid(): boolean {
        let isValid = this.inputPassword.length >= 5;

        if (!isValid) this.errorMessage = 'A senha deve ter no mínimo 5 caracteres.';

        return isValid;
    }

}
