import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { Role } from '../../interface/carlos-auth-interfaces';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    email = '';
    password = '';

    errorMessage = '';

    authService = inject(AuthService);
    router = inject(Router);

    onLogin(): void {
        if (!this.isFormValid) return;

        this.authService.authenticate(this.email, this.password).subscribe({
            next: _ => this.redirectUser(),
            error: err => {
                if (this.isErrorStatus500s(err)) this.errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
                else if (this.isErrorStatus403(err)) this.errorMessage = 'Usuário desativado pelo administrador.';
                else if (this.isErrorStatus401(err)) this.errorMessage = 'Senha incorreta.';
                else this.errorMessage = 'Não há cadastro para o e-mail informado.';
            }
        });
    }

    redirectUser(): void {
        switch (this.authService.roleFrontend) {
            case Role.DIRECTOR:
                this.router.navigate(['/dashboard']);
                break;
            default:
                this.router.navigate(['/inicio']);
        }
    }

    isErrorStatus500s(err: any): boolean {
        if (!err.status) return false;
        return err.status >= 500 && err.status < 600;
    }

    isFormValid(): boolean {
        return this.isEmailValid() && this.isPasswordValid();
    }

    isEmailValid(): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = regex.test(this.email);

        if (!isValid) this.errorMessage = 'Por favor, insira um e-mail válido.';

        return isValid;
    }

    isPasswordValid(): boolean {
        let isValid = this.password.length > 0;

        if (!isValid) this.errorMessage = 'Por favor, insira uma senha válida.';

        return isValid;
    }

    isErrorStatus403(err: any): boolean {
        if (!err.status) return false;
        return err.status == 403;
    }

    isErrorStatus401(err: any): boolean {
        if (!err.status) return false;
        return err.status == 401;
    }
}
