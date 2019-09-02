import React from 'react';
import { Surface, IconButton, Avatar } from 'react-native-paper';
import { View, TextInput } from 'react-native';
import thumb from '../assets/1.jpg'
import { colors } from '../config/Theme';

const SearchBar = ({placeholder = '', value = '', onChangeText = () => {}, onMenu = () => {}, width = '100%', menuOpen = false}) => (
    
    <Surface style={{width, height: 50, borderRadius: 10, flexDirection:'row', justifyContent:'center', alignItems: 'center'}} elevation={2} >
        <View style={{width: 60, height: '100%', justifyContent:'center', alignItems: 'center'}}>
            <IconButton
                icon={menuOpen ? "clear" : "menu" }
                color={colors.primary}
                onPress={() => onMenu()}
            />
        </View>
        <View style={{flex: 1, flexGrow: 4, height: '100%'}}>
            <TextInput 
                placeholder={placeholder} 
                value={value} 
                onChangeText={input => onChangeText(input)} 
                style={{fontSize: 18, color: '#666666', fontFamily: 'Nunito Regular'}} 
                underlineColorAndroid="transparent"
            />
        </View>
        <View style={{width: 60, height: '100%', justifyContent:'center', alignItems: 'center'}}>
            <Avatar.Image
                source={thumb}
                size={36}
                onPress={() => onMenu()}
            />
        </View>
    </Surface>
)

export default SearchBar;