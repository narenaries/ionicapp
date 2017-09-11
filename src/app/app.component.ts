import { Component, ViewChild, Renderer } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

declare var wl_directUpdateChallengeHandler;
declare var WL;
declare var self;

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;
    savedDirectUpdateContext: any;

    pages: Array<{ title: string, component: any }>;

    constructor(private renderer: Renderer, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        self = this;
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: HomePage },
            { title: 'List', component: ListPage }
        ];
        renderer.listenGlobal('document', 'mfpjsloaded', () => {
            console.log("MFP JS is loaded...........")
            wl_directUpdateChallengeHandler.handleDirectUpdate = this.handleDirectUpdateFunction;
            WL.Logger.debug("App started...");
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            WL.Logger.debug("Platform ready...");
        });
    }

    directUpdateListener = {
        onStart: function (status) {
            console.log('onStart: totalSize = ' + status + 'Byte');
        },
        onProgress: function (status, totalSize, completedSize) {
            console.log('onProgress: status = ' + status + ' completeSize = ' + completedSize + 'Byte');
        },
        onFinish: function (status) {
            console.log('onFinish: status = ' + JSON.stringify(status));
            if (status == 'SUCCESS') {
                //show success message
                WL.Client.reloadApp();
            }
            else {
                //submitFailure must be called is case of error
                wl_directUpdateChallengeHandler.submitFailure();
                var pos = status.indexOf("FAILURE");
                if (pos > -1) {
                    WL.SimpleDialog.show('Update Failed', 'Press try again button', [{
                        text: "Try Again",
                        handler: this.restartDirectUpdate // restart direct update
                    }]);
                }
            }
        }
    }
    
    handleDirectUpdateFunction(directUpdateData, directUpdateContext) {
        this.savedDirectUpdateContext = directUpdateContext; // save direct update context
        WL.SimpleDialog.show('Update Avalible', 'Press update button to download new version', [{
            text: 'Update',
            handler: function () {
                console.log("In Update Handler");
                directUpdateContext.start(self.directUpdateListener);
            }
        },
        {
            text: 'Cancel',
            handler: function () {
                console.log('Cancel button handler');
            }
        }
        ]);
    };

    restartDirectUpdate() {
        console.log('restartDirectUpdate');
        this.savedDirectUpdateContext.start(self.directUpdateListener); // use saved direct update context to restart direct update
    };

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
