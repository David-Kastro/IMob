import React, {Component} from 'react';

import { createAppContainer, createStackNavigator, createSwitchNavigator, createDrawerNavigator, SafeAreaView, DrawerItems } from 'react-navigation';

import Loading from '~/pages/Loading';
import Main from '~/pages/Main';
import SignIn from '~/pages/SignIn';
import Schedule from '~/pages/Schedule';
import Notification from '~/pages/Notification';
import Credit from '~/pages/Credit';
import Property from '~/pages/Property';

const AppStack  = createStackNavigator({
    Main: {
        screen: Main
    },
    Schedule: {
        screen: Schedule
    },
    Notification: {
        screen: Notification
    },
    Credit: {
        screen: Credit
    },
    Property: {
        screen: Property
    }
},{
    initialRouteName: 'Main',
    headerMode: 'none',
});

const Routes    = createAppContainer(createSwitchNavigator({ 
    Loading: {
        screen: Loading
    },

    SignIn: {
        screen: SignIn
    },

    AppStack,
},{
    initialRouteName: 'Loading',
}));

/*-------------- Temporário -----------------------*/
const defaultGetStateForAction = Routes.router.getStateForAction;
Routes.router.getStateForAction = (action, state) => {
    const {type, routeName} = action;

    unblockedScreens = [
        'Main',
        'SignIn',
        'Property'
    ]
    
    if( type == 'Navigation/NAVIGATE' && !unblockedScreens.includes(routeName) ) {
        return null
    }
    return defaultGetStateForAction(action, state);
}
/*-------------------------------------------------*/

export default Routes;
