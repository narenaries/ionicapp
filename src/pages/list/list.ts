import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

declare var WLResourceRequest;
declare var WL;
declare var self;
declare var WLAuthorizationManager;

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {

    PinCodeChallengeHandler: any;
    selectedItem: any;
    icons: string[];
    titles: string[];
    items: Array<{ id: number, title: string, note: string, icon: string }>;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        // If we navigated to this page, we will have an item available as a nav param
        self = this;
        this.selectedItem = navParams.get('item');

        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.titles = ['Login', 'Logout', 'getUsers', 'getPosts', 'call DB', 'Item',
            'Item', 'Item', 'Item', 'Item'];

        this.items = [];
        for (let i = 1; i < 11; i++) {
            this.items.push({
                id: i,
                title: this.titles[i-1],
                note: 'This is item #' + i,
                icon: this.icons[i-1]
            });
        }
        this.challengeHandler();
        this.userLoginChallengeHandler();
    }

    challengeHandler() {
        console.log("Init Pincode Challenge Handler");
        self.PinCodeChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("PinCodeAttempts");

        self.PinCodeChallengeHandler.handleChallenge = function (challenge) {
            console.log("handleChallenge: ", challenge);
            var msg = "";

            // Create the title string for the prompt
            if (challenge.errorMsg !== null) {
                msg = challenge.errorMsg + "\n";
            }
            else {
                msg = "This data requires a PIN code.\n";
            }
            msg += "Remaining attempts: " + challenge.remainingAttempts;

            // Display a prompt for user to enter the pin code
            var pinCode = prompt(msg, "");
            if (pinCode) { // calling submitChallengeAnswer with the entered value
                self.PinCodeChallengeHandler.submitChallengeAnswer({ "pin": pinCode });
            }
            else { // calling cancel in case user pressed the cancel button
                self.PinCodeChallengeHandler.cancel();
            }
        };

        // handleFailure
        self.PinCodeChallengeHandler.handleFailure = function (error) {
            console.log("Challenge Handler Failure!");
            if (error.failure !== null && error.failure !== undefined) {
                alert(error.failure);
            }
            else {
                alert("Unknown error");
            }
        };

        // handleSuccess
        self.PinCodeChallengeHandler.handleSuccess = function (sucess) {
            console.log("Challenge Handler Success!", sucess);
        };

    }
    getUsers() {
        //http://localhost:9080/mfp/api/adapters/httpAdapter/getUsers -adapter url
        var resourceRequest = new WLResourceRequest(
            "/adapters/httpAdapter/getUsers",
            WLResourceRequest.GET
        );
        resourceRequest.send().then(
            this.onSuccess,
            this.onFailure
        )
    }
    getPosts() {
        var resourceRequest = new WLResourceRequest(
            "/adapters/httpAdapter/getPosts",
            WLResourceRequest.GET
        );
        resourceRequest.send().then(
            this.onSuccess,
            this.onFailure
        )
    }
    getFilters() {
        //http://localhost:9080/mfp/api/adapters/httpAdapter/getUsers -adapter url
        var resourceRequest = new WLResourceRequest(
            "/adapters/JavaScriptSQL/getAccountTransactions1",
            WLResourceRequest.GET
        );
        resourceRequest.send().then(
            this.onSuccess,
            this.onFailure
        )
    }
    onSuccess(success) {
        console.log("success: ", success);
    }

    onFailure(failure) {
        console.log("fail: ", failure);
    }

    // Login functionality.....
    isChallenged: boolean = false;
    //securityCheckName: string = 'UserLogin';
    securityCheckName: string = 'LDAPLogin';
    loginChallengeHandler: any;
    username: string;
    password: string;

    userLoginChallengeHandler() {

        console.log("Init handleChallenge Login");
        self.loginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(this.securityCheckName);

        self.loginChallengeHandler.securityCheckName = this.securityCheckName;

        self.loginChallengeHandler.handleChallenge = function (challenge) {
            console.log("handleChallenge Login", challenge);
            this.isChallenged = true;

            //Show login page--------------------------

            /*var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
            if (challenge.errorMsg !== null) {
                statusMsg = statusMsg + "<br/>" + challenge.errorMsg;
            }
            document.getElementById("statusMsg").innerHTML = statusMsg;*/
        };

        self.loginChallengeHandler.handleSuccess = function (data) {
            console.log("handleSuccess Login", data);
            this.isChallenged = false;
        };

        self.loginChallengeHandler.handleFailure = function (error) {
            console.log("handleFailure Login: ", error);
            this.isChallenged = false;
            if (error.failure !== null) {
                alert(error.failure);
            } else {
                alert("Failed to login.");
            }
        };

    };

    login(securityCheckName) {
        var username = "narenreddy@in.ibm.com";
        var password = "narendra";

        if (username === "" || password === "") {
            alert("Username and password are required");
            return;
        }
        if (this.isChallenged) {
            self.loginChallengeHandler.submitChallengeAnswer({ 'username': username, 'password': password });
        } else {
            WLAuthorizationManager.login(securityCheckName, { 'username': username, 'password': password }).then(
                function () {
                    console.log("login onSuccess");
                },
                function (response) {
                    console.log("login onFailure: " + JSON.stringify(response));
                });
        }
    }

    logout(securityCheckName) {
        WLAuthorizationManager.logout(securityCheckName).then(
            function () {
                console.log("logout onSuccess");
                location.reload();
            },
            function (response) {
                console.log("logout onFailure: " + JSON.stringify(response));
            });
    }

    itemTapped(event, item) {
        if (item.id == 1) this.login(this.securityCheckName);
        if (item.id == 2) this.logout(this.securityCheckName);
        if (item.id == 3) this.getUsers();
        if (item.id == 4) this.getPosts();
        if (item.id == 5) this.getFilters();

        // That's right, we're pushing to ourselves!
        /*this.navCtrl.push(ListPage, {
            item: item
        });*/
    }
}
