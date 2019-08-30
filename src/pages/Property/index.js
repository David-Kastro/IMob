import React, {Component} from 'react';

import { Image, View, ScrollView, Dimensions, StatusBar, Text } from 'react-native';
import { IconButton, Title, Subheading, FAB, Paragraph, Divider, Colors } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as AuthActions } from "../../store/ducks/Authentication";
import { Creators as PropertiesActions } from "../../store/ducks/Properties";

import { colors } from '../../config/Theme';

const panelHeight = Dimensions.get('window').height * 0.45;
const cardRadius = 0;

class Property extends Component {

  state = {
    scrollViewOffset: 0,
    navigationColorIsDark: false,
    scrollViewOnEnd: false,
  }

  close() {
    this.props.navigation.goBack()
  }

  handleScrollEvent( offsetY ) {

    const { navigationColorIsDark } = this.state;
    const hasReachedNavigation      = (panelHeight - offsetY) < (30 + cardRadius);

    if( hasReachedNavigation ) {
      !navigationColorIsDark && this.setState({navigationColorIsDark: true, scrollViewOnEnd: true});
    } else {
      !!navigationColorIsDark && this.setState({navigationColorIsDark: false, scrollViewOnEnd: false});
    }

  }

  render() {
    const { properties } = this.props;
    const {image, title, description, price} = properties.properties.filter( property => property.id == properties.selectedProperty )[0]

    return (
      <>
        <StatusBar barStyle="light-content" translucent={true}/>

        <View style={{flex: 1, flexDirection: 'column'}}>
    
          <Image source={image} style={{width: '100%', height: panelHeight, position:"absolute"}}></Image>
          
          <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView }}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            contentContainerStyle={{paddingTop: panelHeight - cardRadius}}
            decelerationRate={0.87}
            snapToInterval={panelHeight}
            snapToAlignment="center"
            onScroll={(event => this.handleScrollEvent(event.nativeEvent.contentOffset.y))}
          >
            <View style={{width: '100%', height: Dimensions.get('window').height, backgroundColor: 'white', borderTopLeftRadius: this.state.scrollViewOnEnd ? 0 : cardRadius, borderTopRightRadius:  this.state.scrollViewOnEnd ? 0 : cardRadius}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flexDirection: 'row-reverse', width: '100%'}}>
                    <FAB
                      elevation={6}
                      icon="favorite"
                      color="#ff3300"
                      style={{backgroundColor: 'white', top: -30, right: -50}}
                    />
                </View>
                <View style={{marginHorizontal: 15, marginTop: -30}}>

                  <Subheading style={{color: '#666666'}}>Águas Claras</Subheading>
                  <Title style={{fontSize: 26, color: '#666666'}}>{title}</Title>

                  <View style={{flexDirection: 'row', justifyContent: "center", alignItems: 'center', marginTop: 15}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <FAB
                        elevation={6}
                        icon="business"
                        color='white'
                        style={{backgroundColor: colors.primary}}
                      />
                    </View>
                    <View style={{flex: 1, flexGrow: 3}}>
                      <Paragraph style={{fontSize: 16, color: '#737373'}}>{description}</Paragraph>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: "center", alignItems: 'center', marginTop: 20}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <FAB
                        elevation={6}
                        icon="attach-money"
                        color={colors.primary}
                        style={{backgroundColor: 'white'}}
                      />
                    </View>
                    <View style={{flex: 1, flexGrow: 3}}>
                      <Paragraph style={{fontSize: 18, color: '#737373'}}>Aluguel: {price}</Paragraph>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center", marginTop: 15}}>
                    <Ripple 
                      rippleColor="#fff" 
                      rippleOpacity={1} 
                      onPress={() => this.close()}
                    >
                      <IconButton
                        icon="expand-more"
                        color={colors.secondary}
                        size={40}
                        style={{width: 40, height: 40}}
                      />
                    </Ripple>
                  </View>

                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={{position: 'absolute', top: 30, left: 10}}>
      
          <Ripple 
            rippleColor="#fff" 
            rippleOpacity={1} 
            onPress={() => this.close()}
          >
            <IconButton
              icon="arrow-back"
              color={this.state.navigationColorIsDark ? 'black' : 'white'}
              size={30}
              style={{width: 30, height: 30}}
            />
          </Ripple>
    
        </View>

        <View style={{position: 'absolute', top: 30, right: 10}}>
      
          <Ripple 
            rippleColor="#fff" 
            rippleOpacity={1} 
            onPress={() => this.close()}
          >
            <IconButton
              icon="more-horiz"
              color={this.state.navigationColorIsDark ? 'black' : 'white'}
              size={30}
              style={{width: 30, height: 30}}
            />
          </Ripple>
    
        </View>

      </>
    )
  }
};

const mapStateToProps = state => ({
  auth: state.authReducers,
  properties: state.propertiesReducers
});

const mapDispatchToProps = dispatch => bindActionCreators({...AuthActions, ...PropertiesActions}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Property);

