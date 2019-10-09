import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UiManagerService } from '../services/ui-manager.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
})
export class ProfileEditPage implements OnInit {
    form: FormGroup;
    name: string;
    image: string;
    score: string;
    user: User;
    userId: string;

    downloadURL: Observable<string>;
    uploadPercent: Observable<number>;

    profileUrl: Observable<string | null>;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private storage: AngularFireStorage,
        private uiManager: UiManagerService,
    ) {}

    ngOnInit() {
        this.userId = this.authService.getUserId();
        this.setForm(null);

        this.userService.getUser(this.userId)
                .pipe(take(1))
                .subscribe(
                    res => {
                        this.setForm(res.name);
                        this.image = res.image;
                    }
                );
    }

    uploadFile(event) {
        const file = event.target.files[0];
        const filePath = 'users/' + this.userId;
        const fileRef = this.storage.ref(filePath);

        const task = this.storage.upload(filePath, file);
        // this.uploadPercent = task.percentageChanges();
        task.snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        this.updateImage();
                    } )
                )
                .subscribe();
    }

    updateImage() {
        this.downloadURL.subscribe(imageUrl => {
            this.userService.updateUserImage(this.userId, imageUrl);
            this.image = imageUrl;
        });
    }

    setForm( name: string ) {
        this.form = new FormGroup({
            name: new FormControl(name, {
                updateOn: 'blur',
                validators: [Validators.required]
            })
        });
    }

    onSubmit() {
        const updatedData = {
            name: this.form.value.name,
            score: 100
        };

        this.userService
            .updateUser(this.userId, updatedData)
            .then(res => {
                this.uiManager.navigateTo('/restaurantes');
            })
            .catch(err => (console.log(err)));
    }

}
