import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

import { AuthService } from './auth.service';
import { User } from '../model/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { UiManagerService } from './ui-manager.service';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        private uiManager: UiManagerService,
        private firebaseAuth: AngularFireAuth,
        private authService: AuthService,
        private firebase: AngularFirestore) {}

    // private uid = this.authService.getUserId();

    updateUser(userId: string, user: object) {
        return this.firebase.collection('users').doc(userId).update(user);
    }

    updateUserImage(userId: string, imageUrl: string) {
        return this.firebase.collection('users').doc(userId).update({image: imageUrl});
    }

    // updateUserScore(userId: string, newScore: number) {
    //     return this.firebase.collection('users').doc(userId).update({score: newScore});
    // }

    addGeneratedCode(uniqueId: string) {
        return this.firebase.collection('genetated-codes').add({id: uniqueId});
    }

    getGeneratedCodes(uniqueId: string) {
        return this.firebase
                    .collection(
                        'genetated-codes',
                        ref => ref.where('id', '==', uniqueId)
                    )
                    .snapshotChanges()
                    .pipe (
                        map ( ( docArray: DocumentChangeAction<any>[] ) => {
                            return docArray.map( ( doc: DocumentChangeAction<any> ) => {
                                return  doc.payload.doc.data();
                            });
                        }),
                    );
    }

    getUser(userId: string) {
        return this.firebase
                    .doc<User>('users/' + userId)
                    .snapshotChanges()
                    .pipe (
                        map ( doc => {
                            const data = doc.payload.data();
                            const id = doc.payload.id;
                            return { ...data, id  };
                        })
                    );
    }

    updateUserScore(restaurantId: string, userId: string, newScore: number) {
        return this.firebase
            .doc('users/' + userId + '/score/' + restaurantId)
            .set({score: newScore});
    }

    getUserScore(restaurantId: string, userId: string) {
        return this.firebase
            .doc<{score: number}>('users/' + userId + '/score/' + restaurantId)
            .snapshotChanges()
            .pipe (
                map ( doc => {
                    return doc.payload.data();
                })
            );
    }

    // addUserScore(restaurantId: string, userId: string, score: any) {
    //     return this.firebase
    //         .doc('users/' + userId + '/score/' + restaurantId)
    //         .set({...score});
    // }


}
