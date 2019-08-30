import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { colors } from '../config/Theme';
import {Card, IconButton} from 'react-native-paper';
import Ripple from 'react-native-material-ripple';

const cardsWidth = 120;
const cardsHeight = 100;

const menuItems = [
    {
        id: 1,
        title: 'Mapa',
        icon: 'map',
    },
    {
        id: 2,
        title: 'Agendamento',
        icon: 'event',
    },
    {
        id: 3,
        title: 'Notificações',
        icon: 'notifications-none',
    },
    {
        id: 4,
        title: 'Análise de Crédito',
        icon: 'credit-card',
    },
    {
        id: 5,
        title: 'Filtros',
        icon: 'tune',
    },
];

class MenuItem extends Component{

    state = {
        opacity   : new Animated.Value(0),
        scale     : new Animated.Value(0.1),
    }

    componentDidMount() {
        this.runAnimation(this.props.timeout);
    }

    runAnimation(timeout) {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: timeout,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.scale, {
            toValue: 1,
            duration: timeout,
            useNativeDriver: true
        }).start();
    }

    render() {
        const {id, title, icon, selected, select} = this.props;

        return (
            <Card elevation={3} style={[styles.card, {opacity: this.state.opacity, transform: [{scale: this.state.scale}]}]}>
                <Ripple
                    style={{height: cardsHeight, width: cardsWidth }}
                    rippleColor={id === selected ? 'white' : colors.primary} 
                    rippleOpacity={1} 
                    rippleDuration={500} 
                    onPress={() => select(id)}
                >
                    <View style={[styles.content, {backgroundColor: id === selected ? colors.primary : 'white'}]}>
                        <IconButton
                            icon={icon}
                            color={id === selected ? 'white' : colors.secondary}
                            style={{width: 36, height: 36}}
                            size={36}
                        ></IconButton>
                        <Text style={{color: id === selected ? 'white' : colors.secondary}}>{title}</Text>
                    </View>
                </Ripple>
            </Card>
        );
    }
}

export default class HorizontalMenu extends Component {

    state = {
        selected: 1,
    }

    render() {

        return (
        
            <View style={styles.container}>
                
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 10, paddingVertical: 10}}
                    style={{position: 'absolute'}}
                >
                    { menuItems.map( item => (
                        <MenuItem 
                            key={item.id} 
                            id={item.id} 
                            title={item.title} 
                            icon={item.icon} 
                            selected={this.state.selected}
                            timeout={200 + (150 * +item.id)} 
                            select={(id) => this.setState({selected: id})}
                        />
                    ))}

                </ScrollView>  
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    card: {
        borderRadius: 5, 
        overflow: 'hidden',
        width: cardsWidth, 
        height: cardsHeight, 
        marginHorizontal: 5,
    },
    content: {
        flex: 1,
        justifyContent: "center", 
        alignItems: "center", 
        flexDirection: "column"
    }
})