import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../interface/carlos-auth-interfaces';
import { UserService } from '../../service/user-service';
import { fromRolesDTOToRoles, fromRoleToRoleDTO, mapRoleToDescription } from '../../mappers/auth-mapper';
import { UserGetResponseDTO, UserStatusEnumDTO } from '../../interface/carlos-user-interfaces';

@Component({
    selector: 'app-user-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './user-edit-modal.component.html',
    styleUrl: './user-edit-modal.component.scss'
})
export class UserEditModalComponent {
    @Input({ required: true }) userId = 0;

    @Output() userEdit = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    userService = inject(UserService);

    inputName = '';
    inputEmail = '';
    inputPassword = '';
    inputRoleSelected = Role.DIRECTOR.toString();
    inputIsUserActive = true;

    errorMessage = '';

    isSubmitButtonDisabled = false;

    mouseDownOnOverlay = false;

    ngOnInit() {
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
        this.fillFormFromHttpRequest();
    }

    fillFormFromHttpRequest() {
        this.userService.getUserById(this.userId).subscribe({
            next: user => this.fillFormFromDTO(user),
            error: _ => { 
                this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
                this.isSubmitButtonDisabled = true;
            }
        });
    }

    fillFormFromDTO(user: UserGetResponseDTO): void {
        this.inputName = user.name;
        this.inputEmail = user.email;
        this.inputRoleSelected = fromRolesDTOToRoles(user.role)?.toString() ?? '';
        this.inputIsUserActive = user.status == UserStatusEnumDTO.ACTIVE;
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

        this.userService.editUser(this.userId, this.inputName, this.inputPassword || null, role, status).subscribe({
            next: _ => this.userEdit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
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
        return this.isPasswordFilled() ? this.isPasswordSizeValid() : true;
    }

    isPasswordFilled(): boolean {
        let isPasswordFilled = !!this.inputPassword.trim();
        return isPasswordFilled;
    }

    isPasswordSizeValid(): boolean {
        let isValid = this.inputPassword.length >= 5;

        if (!isValid) this.errorMessage = 'A senha deve ter no mínimo 5 caracteres.';

        return isValid;
    }

}
