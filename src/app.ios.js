/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { View, NetInfo, AppState } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { registerScreens } from './screens';
import CheckUpdate from './component/check_update/check_update';
import { iconsMap, iconsLoaded } from './utils/AppIcons';
import configureStore from './store/configureStore';

const store = configureStore();

registerScreens(store, Provider);

const navigatorStyle = {
	navBarTranslucent: true,
	drawUnderNavBar: true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white',
	statusBarTextColorScheme: 'light',
	drawUnderTabBar: true
};

class App extends Component {
	constructor(props) {
		super(props);
		this.checkConnection = this.checkConnection.bind(this);
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
		this.startApp = this.startApp.bind(this);
		this.callackUpdate = this.callackUpdate.bind(this);
		this.update = new CheckUpdate(this.callackUpdate, this.showForm);
		this.checkConnection();
	}
	checkConnection() {
		this.showForm(false);
		NetInfo.isConnected.fetch().then((isConnection) => {
			this.update.updateSoftware();
			AppState.addEventListener('change', this._handleAppStateChange);
		}).catch(error => {
		});
	}
	_handleAppStateChange(nextAppState) {
		if (nextAppState === 'active') {
			this.update.updateSoftware();
		}
	}
	showForm(isUpdating) {
		Navigation.startSingleScreenApp({
			screen: {
				screen: 'movieapp.BusyBox',
				screenBackgroundColor: 'transparent',
				navigatorStyle: {
					drawUnderNavBar: true,
					navBarHidden: true,
					navBarHideOnScroll: false,
					statusBarTextColorScheme: 'light'
				}
			},
			passProps: {
				isUpdating
			}
		});
	}
	cbeckUpdate() {
		this.update.updateSoftware();
	}
	callackUpdate() {
		iconsLoaded.then(() => {
			this.startApp();
		});
	}
	startApp() {
		Navigation.startTabBasedApp({
			tabs: [
				{
					label: 'Movies',
					screen: 'movieapp.Movies',
					icon: iconsMap['ios-film-outline'],
					selectedIcon: iconsMap['ios-film'],
					title: 'Movies',
					navigatorStyle,
					navigatorButtons: {
						rightButtons: [
							{
								title: 'Search',
								id: 'search',
								icon: iconsMap['ios-search']
							}
						]
					}
				},
				{
					label: 'TV Shows',
					screen: 'movieapp.Movies',
					icon: iconsMap['ios-desktop-outline'],
					selectedIcon: iconsMap['ios-desktop'],
					title: 'Movies',
					navigatorStyle
				}
			],
			tabsStyle: {
				tabBarButtonColor: 'white',
				tabBarSelectedButtonColor: 'white',
				tabBarBackgroundColor: 'black'
			}
		});
	}
}

export default App;
