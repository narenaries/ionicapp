import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var WL: any;
declare var WLAuthorizationManager: any;
declare var MFPPush: any;
declare var self;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    _mytext = "message";

    @Input()
    get mytext() {
        return this._mytext;
    }

    @Output() mytextChange = new EventEmitter();

    set mytext(val) {
        console.log("set mytext: ", val);
        this._mytext = val;
        this.mytextChange.emit(this._mytext);
    }

    tags = ['cloud', 'watson'];

    constructor(public navCtrl: NavController) {
        self = this;
        this.pushInit();
    }
    logMsg() {
        this.mytext = "In Logger...";

        //WL.Logger.config({ level: 'DEBUG' });
        //WL.Logger.config({ capture: true });
        //WL.Logger.config({ maxFileSize: 150000 });
        //WL.Logger.config({ autoSendLogs: true});
        WL.Logger.updateConfigFromServer();

        //This is the least recommended approach.
        WL.Logger.debug('debug', [1, 2, 3], { hello: 'world' });
        WL.Logger.trace('trace', 'another message');
        WL.Logger.log('log', 'another message');
        WL.Logger.info('info', 1, 2, 3);
        WL.Logger.warn('warn', undefined);
        WL.Logger.error('error', new Error('oh no'));
        WL.Logger.fatal('fatal', 'another message');
        
        WL.Logger.send();
        //var logger = WL.Logger.create({ pkg: 'MathUtils' });
        //logger.debug('Custom package based logger');

       /* WL.Logger.ctx({ pkg: 'myPkg' }).debug('debug', [1, 2, 3], { hello: 'world' });
        WL.Logger.ctx({ pkg: 'wl.whatever' }).trace('trace', 'another message');   
        WL.Logger.ctx({ pkg: 'wl.whatever' }).log('log', 'another message');
        WL.Logger.ctx({ pkg: 'wl.whatever' }).info('info', 1, 2, 3);
        WL.Logger.ctx({ pkg: 'wl.whatever' }).warn('warn', undefined);
        WL.Logger.ctx({ pkg: 'wl.whatever' }).error('error', new Error('oh no'));
        WL.Logger.ctx({ pkg: 'wl.whatever' }).fatal('fatal', 'another message');*/

        //WL.Analytics.log("Message", {"analyticsJSON" : "working..."});
        //WL.Analytics.send();
    }
    connectToMFPserver() {
        WL.Client.connect({
            onSuccess: this.onConnectSuccess,
            onFailure: this.onConnectFailure
        });
    }
    onConnectSuccess(success) {
        console.log(">> Connected to MobileFirst Server: ", JSON.stringify(success));
        self.mytext = "Connection Success MFP";
    }
    onConnectFailure(failed) {
        console.log(">> Failed to connect to MobileFirst Server: ", JSON.stringify(failed));
        self.mytext = "Connection Fail MFP";
    }

    authorize() {
        WLAuthorizationManager.obtainAccessToken().then(
            function (accessToken) {
                console.log("Authorize Success - Connected to MobileFirst Server: ", JSON.stringify(accessToken));
                self.mytext = "Authorization Success";
            },
            function (error) {
                console.log("Authorize Failed to connect to MobileFirst Server: ", JSON.stringify(error));
                self.mytext = "Authorization Fail";
            }
        );
    };

    pushInit() {
        MFPPush.initialize(
            function (successResponse) {
                console.log("Push Successfully intialized: " + JSON.stringify(successResponse));
                MFPPush.registerNotificationsCallback(self.notificationReceived);
            },
            function (failureResponse) {
                console.log("Failed to initialize Push");
            }
        );
    }

    notificationReceived(message) {
        alert("notificationReceived: " + JSON.stringify(message));
    };

    isPushSupported() {
        MFPPush.isPushSupported(
            function (successResponse) {
                console.log("Push Supported: " + JSON.stringify(successResponse));
            },
            function (failureResponse) {
                console.log("Failed to get push support status");
            }
        );
    };

    registerDevice() {
        MFPPush.registerDevice(
            {},
            function (successResponse) {
                console.log("Successfully registered " + JSON.stringify(successResponse));
            },
            function (failureResponse) {
                console.log("Failed to register " + JSON.stringify(failureResponse));
            }
        );
    }
    getTags() {
        MFPPush.getTags(
            function (tags) {
                console.log(JSON.stringify(tags));
            },
            function (fail) {
                console.log("Failed to get tags " + JSON.stringify(fail));
            }
        );
    }
    subscribe() {
        MFPPush.subscribe(
            this.tags,
            function (tags) {
                console.log("Subscribed successfully" + JSON.stringify(tags));
            },
            function (fail) {
                console.log("Failed to subscribe" + JSON.stringify(fail));
            }
        );
    }
    getSubscriptions() {
        MFPPush.getSubscriptions(
            function (subscriptions) {
                console.log("subscriptions Success: " + JSON.stringify(subscriptions));
            },
            function (fail) {
                console.log("Failed to get subscriptions" + JSON.stringify(fail));
            }
        );
    }
    unsubscribe() {
        MFPPush.unsubscribe(
            this.tags,
            function (tags) {
                console.log("Unsubscribed successfully" + JSON.stringify(tags));
            },
            function (fail) {
                console.log("Failed to unsubscribe" + JSON.stringify(fail));
            }
        );
    };
    unregisterDevice() {
        MFPPush.unregisterDevice(
            function (successResponse) {
                console.log("Unregistered successfully" + JSON.stringify(successResponse));
            },
            function (fail) {
                console.log("Failed to unregister " + JSON.stringify(fail));
            }
        );
    };
}
