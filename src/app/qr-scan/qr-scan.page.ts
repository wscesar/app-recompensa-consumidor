import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { UiManagerService } from '../services/ui-manager.service';


@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

    constructor(
        private platform: Platform,
        private alertCtrl: AlertController,
        private uiManager: UiManagerService,
        private qrScanner: QRScanner
        ) { }



  ngOnInit() {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
        if (status.authorized) {

            this.qrScanner.show();

            const scanSub =
            this.qrScanner.scan()
                .subscribe(
                    res => {
                        console.log('Scanned something', res);
                        this.uiManager.alert('erro', res);
                        this.qrScanner.hide(); // hide camera preview
                        scanSub.unsubscribe(); // stop scanning
                    },

                    err => {
                        const errorMessage = JSON.stringify(err);
                        this.uiManager.alert('erro', errorMessage);
                    }
                );

        } else if (status.denied) {

        } else {

        }
    }).catch((e: any) => console.log('Error is', e));
    }

}
