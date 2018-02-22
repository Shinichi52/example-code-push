import codePush from 'react-native-code-push';
import React, { Component } from 'react';
import { View, Alert, AppState, Platform, Linking, PixelRatio } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { logDevice } from '../../lib/base/functionUtil';

const codePushOptions = {
    installMode: codePush.InstallMode.IMMEDIATE
    // installMode: Platform.OS === 'ios' ? codePush.InstallMode.ON_NEXT_RESTART : codePush.InstallMode.IMMEDIATE
}

export default class CheckUpdate {
    constructor(handlerUpToDate, showFn) {
        this.isUpdating = false;
        this.preUpdateTime = null;
        this.showFn = showFn;
        this.handlerUpToDate = handlerUpToDate;
        this.updateSoftware = this.updateSoftware.bind(this);
        this.changStateCodePush = this.changStateCodePush.bind(this);
    }

    changStateCodePush(syncStatus) {
        logDevice('info', `syncStatus... ${syncStatus}`);
        switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                logDevice('info', 'Checking for updates.');
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                logDevice('info', 'Downloading package.');
                this.isUpdating = true;
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                logDevice('info', 'Installing update.');
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                logDevice('info', 'Up-to-date.');

                this.handlerUpToDate && this.handlerUpToDate();
                this.handlerUpToDate = null;
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                // SplashScreen.show()
                logDevice('info', 'Update installed.');
                // if (Platform.OS === 'ios') {
                //     logDevice('info', '===> Begin set timeout restart');
                //     logDevice('info', '===> Restart app');
                //     RNRestart.Restart();
                // }
                break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
                // this.showFn && this.showFn('updating');
                // if (Platform.OS === 'android') {
                logDevice('info', 'begin set timeout...');
                // // dam bao js file da duoc load
                // // setTimeout(() => {
                logDevice('info', 'handlerUpToDate with UNKNOWN ERROR: ' + syncStatus);
                this.handlerUpToDate && this.handlerUpToDate();
                this.handlerUpToDate = null;
                // }, 2000);
                break;
            default:
                break;
        }
    }


    updateSoftware() {
        codePush.sync(codePushOptions, this.changStateCodePush);
    }
}
