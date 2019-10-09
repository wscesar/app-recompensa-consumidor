import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['auth.page.sass']
})
export class AuthPage implements OnInit {

    form: FormGroup;
    icon = 'eye';
    authMode = 'login';
    authMode02 = 'criar conta';
    inputType = 'password';
    errorMessage: string;

    constructor(
        private authService: AuthService
        ) {}

    ngOnInit() {

        this.form = new FormGroup({

            name: new FormControl(null, {
                updateOn: 'change',
            }),

            email: new FormControl('william@email.com', {
                updateOn: 'change',
                validators: [Validators.required, Validators.email]
            }),

            password: new FormControl('1qazxsw2', {
                updateOn: 'change',
                validators: [Validators.required, Validators.minLength(8)]
            })

        });

    }


    onChangeMode() {
        if ( this.authMode === 'login' ) {
            this.authMode = 'criar conta';
            this.authMode02 = 'login';
        } else {
            this.authMode = 'login';
            this.authMode02 = 'criar conta';
        }
    }


    onTogglePassword() {
        if ( this.icon === 'eye-off' ) {
            this.icon = 'eye';
            this.inputType = 'password';
        } else {
            this.icon = 'eye-off';
            this.inputType = 'text';
        }
    }


    onGoogleLogin() {
        this.authService.googleLogin();
    }


    onFacebookLogin() {
        this.authService.facebookLogin();
    }


    onSubmit() {

        if (this.authMode === 'login') {

            this.authService.loginWithEmail(
                this.form.value.email,
                this.form.value.password
            );

        } else {

            this.authService.createUser(
                this.form.value.name,
                this.form.value.email,
                this.form.value.password
            );

        }

    }

}
