import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UiManagerService } from '../services/ui-manager.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.sass']
})
export class ProfileEditPage implements OnInit {
    private form: FormGroup;
    private userId: string;

    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;

    profileUrl: Observable<string | null>;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private uiManager: UiManagerService,
    ) {}

    ngOnInit() {
        this.userId = this.authService.getUserId();

        this.form = new FormGroup({
            name: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),
            email: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),
            phone: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),
            city: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            }),
            birthday: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required]
            })
        });

        this.userService.getUser(this.userId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.form.patchValue({
                            name: res.name,
                            email: res.email,
                            phone: res.phone,
                            city: res.city,
                            birthday: res.birthday,
                        });

                    }
                );
    }

    onSubmit() {
        const updatedUser = {
            name: this.form.value.name,
            email: this.form.value.email,
            phone: this.form.value.phone,
            city: this.form.value.city,
            birthday: this.form.value.birthday,
            score: 100
        };

        this.userService
            .updateUser(this.userId, updatedUser)
            .then( () => {
                this.uiManager.navigateTo('/restaurantes');
            })
            .catch(err => (console.log(err)));
    }

}
