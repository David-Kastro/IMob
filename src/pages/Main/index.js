import React, {Component} from 'react';

import { colors } from '../../config/Theme';

import { View, StyleSheet, StatusBar, Platform, Dimensions, ScrollView, Image, Text } from 'react-native';
import { Card, Paragraph, Subheading, Chip, FAB, Title, Caption } from 'react-native-paper';
import Searchbar from '../../components/SearchBar';
import HorizontalMenu from '../../components/HorizontalMenu';
import Ripple from 'react-native-material-ripple';
import debounce from 'lodash/debounce';

import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as AuthActions } from "../../store/ducks/Authentication";
import { Creators as PropertiesActions } from "../../store/ducks/Properties";

import Properties from './properties';

import MapboxGL from '@mapbox/react-native-mapbox-gl';
import firebase from 'react-native-firebase';

MapboxGL.setAccessToken('pk.eyJ1IjoiZGF2aWRrYXMiLCJhIjoiY2p5ZzNrOXBhMWlxcDNscW91bnYzaGhqMiJ9.Jafi9wsh04DbaaIYjFSrVQ');

const cardsWidth = Dimensions.get('window').width * 0.88;
const cardsHeight = Dimensions.get('window').width * 0.36;
const cardsSpacing = 10;

const imoveis = [
  {
    id: 1,
    title: 'SQN 115 Bloco J',
    description: 'Apartamento espaçoso com 2 quartos, sendo 1 suíte, e uma boa vista.',
    type: 'Apartamento',
    image: require('../../assets/img1.jpg'),
    price: 'R$ 4.800',
    size: '65',
    dorms: '2',
    baths: '2',
    longitude: -48.033634050658634,
    latitude: -15.837634192063879,
    favorited: false,
  },
  {
    id: 2,
    title: 'Quadra 101 Lote 08 Bloco A/B',
    description: 'Apartamento com 2 quartos e uma boa vista.',
    type: 'Apartamento',
    image: require('../../assets/img2.jpg'),
    price: 'R$ 5.920',
    size: '84',
    dorms: '3',
    baths: '2',
    longitude: -48.038123315092264,
    latitude: -15.838789075651658,
    favorited: false,
  },
  {
    id: 3,
    title: 'SQN 309 Bloco K',
    description: 'Apartamento com 2 quartos e uma boa vista.',
    type: 'Apartamento',
    image: require('../../assets/img3.jpg'),
    price: 'R$ 1.780',
    size: '51',
    dorms: '1',
    baths: '2',
    longitude: -48.0374454693366,
    latitude: -15.841130224199306,
    favorited: false,
  },
  {
    id: 4,
    title: 'SCN Quadra 1 Lote 50 Bloco E',
    description: 'Apartamento com 2 quartos e uma boa vista.',
    type: 'Apartamento',
    image: require('../../assets/img4.jpg'),
    price: 'R$ 8.600',
    size: '116',
    dorms: '4',
    baths: '2',
    longitude: -48.036106759843506,
    latitude: -15.83844616645192,
    favorited: false,
  },
]

class Main extends Component {

  state = {
    currentPosition: null,
    currentCard: 0,
    search: "",
    showMenu: false,
  }

  goToCurrentLocation = debounce( this.goToCurrentLocation, 500 );
  selectProperty      = debounce( this.selectProperty, 800 );

  async signOut() {
    
    const { auth }            = this.props;

    this.props.SignoutLoading( auth.loading );

    try {

        await firebase.auth().signOut();

    } catch(err) {

        this.props.SignoutError(err);

    }   
  }

  async componentDidMount() {

    await this.props.SetProperties(imoveis)
    setTimeout(() => this.selectProperty(0), 1000)

    navigator.geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => {
        this.setState({
          currentPosition: [longitude, latitude],
        })
      },
      (err) => {console.log( err )},
      {
        timeout: 2000,
      }
    )
  }
  
  ellipsisText( text, maxLenght ) {
    const result = ( ( text ).length > maxLenght ) 
      ? ( ( ( text ).substring( 0, maxLenght - 3 ) ) + '...' ) 
      : text;

    return result;
  }

  async goToCurrentLocation() {

    if( this.state.currentPosition ) {

      await this.map.flyTo(this.state.currentPosition)
      this.map.zoomTo(15, 500)

    } else {
      navigator.geolocation.getCurrentPosition(
        async ({coords: {latitude, longitude}}) => {
  
          const location = [longitude, latitude]

          await this.map.flyTo(location, 800)
          this.map.zoomTo(15, 500)
  
        },
        (err) => {console.log( err )},
        {
          timeout: 2000,
        }
      )
    }
    
  }
  
  renderStatusBar() {
    return(
      Platform.select({
        ios: <StatusBar barStyle = "dark-content"/>,
  
        android: 
          <StatusBar 
            barStyle        = {Platform.Version < 23 ? "light-content" : "dark-content"}
            backgroundColor = {Platform.Version < 23 ? "rgba(0,0,0,0.3)" : "transparent"}
            translucent     = {true}/>
      })
    )
  }

  selectPropertyByOffset( offsetX ) {
    const propertyIndex = Math.round(offsetX / (cardsWidth + cardsSpacing));
    this.selectProperty(propertyIndex);
  }

  async selectProperty(index) {
    const { properties } = this.props;
    const {id, longitude, latitude} = properties.properties[index]; 

    this.props.SelectProperty(id)
    await this.map.flyTo([longitude, latitude], 800);
    this.map.zoomTo(15, 500);
  }

  toggleFavorite(id) {
    const { properties } = this.props;
    const property = properties.properties.filter( property => property.id == id )[0]
    
    property.favorited  && this.props.UnfavoriteProperty( id );
    !property.favorited && this.props.FavoriteProperty( id );

  }

  render() {
    const { auth, properties } = this.props;

    return (
      <>
        {this.renderStatusBar()}
        
        <MapboxGL.MapView
          ref={(map) => this.map = map}
          centerCoordinate={[ -48.0357447, -15.8398551 ]}
          contentInset={[0,0,80,0]}
          zoomLevel={15}
          style={styles.container}
          styleURL={MapboxGL.StyleURL.Light}
          logoEnabled={false}
          showUserLocation
        >
          <Properties />
        </MapboxGL.MapView>

        {/*TOP*/}
        <LinearGradient 
          colors={["white", "#ffffff00"]} 
          style={{flex: 1, position:'absolute', top: 0, width: Dimensions.get('window').width, height: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
        >
        </LinearGradient>

        {/*BOTTOM*/}
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 0, y: 0}}
          colors={["white", "#ffffff00"]} 
          style={{position:'absolute', bottom: 0, width: Dimensions.get('window').width, height: 200}}
        >
        </LinearGradient>

        <View style={{flex: 1, flexDirection:'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 30, width: Dimensions.get('window').width}}>
          <Searchbar
            placeholder="Buscar Local"
            onChangeText={ input => { this.setState({ search: input }) } }
            onMenu={() => this.setState({showMenu: !this.state.showMenu})}
            menuOpen={this.state.showMenu}
            value={this.state.search}
            width={Dimensions.get('window').width * 0.90}
          />
          {
            this.state.showMenu ? <HorizontalMenu SignOut={() => this.signOut()} /> : null
          }
        </View>
        
        {/* bottom == scrollview height + 10 */}

        <View style={{flex: 1, flexDirection: 'column', position: 'absolute', bottom: 0}}>

          <View style={{marginLeft: 20}}>
            <Title style={{fontSize: 22, color: colors.secondary}}>Águas Claras</Title>
            <Caption style={{marginTop: -6, fontSize: 14}}>Brasília</Caption>
          </View>

          <View style={{position: 'absolute', top: -20,  right: 10}}>
            <FAB
              elevation={6}
              icon="navigation"
              onPress={() => this.goToCurrentLocation()}
              color={colors.primary}
              style={{backgroundColor: 'white'}}
            />
          </View>

          <ScrollView
            ref={(scrollView) => { this.scrollView = scrollView }}
            horizontal={true}
            alwaysBounceHorizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.9}
            snapToInterval={cardsWidth + cardsSpacing} //your element width + margin
            snapToAlignment={"center"}
            contentContainerStyle={{paddingHorizontal: Dimensions.get('window').width * 0.5 - (cardsWidth / 2)}}
            onMomentumScrollEnd={ (event) => this.selectPropertyByOffset(event.nativeEvent.contentOffset.x) }
          >
            { properties.properties.map( property => (

              <Card elevation={2} key={`property_${property.id}`} style={{width: cardsWidth, height: cardsHeight, marginHorizontal: (cardsSpacing / 2), marginVertical: 10, overflow: 'hidden', borderRadius: 20}}>
                <Ripple
                  style={{height: '100%', flexDirection: 'row' }}
                  rippleColor="white" 
                  rippleOpacity={1} 
                  rippleDuration={1000}
                  onPress={() => this.props.navigation.navigate('Property')}
                >
                  <View style={{flex: 1, flexGrow: 2}}>
                      <Image 
                        style={{width: '100%', height: cardsHeight}} 
                        source={property.image} />
                  </View>
                  <View style={{flex: 1, flexGrow: 3, flexDirection: 'column', justifyContent: "space-between"}}>
                      <View style={{marginTop: 10, marginLeft: 10}}>
                        <Title style={{color: '#666666', fontSize: 16}}>
                          {this.ellipsisText( property.title, 22)}
                        </Title>
                        <Caption>{this.ellipsisText( property.description, 50)}</Caption>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Chip elevation={0} icon="straighten" selectedColor='#787878' style={{backgroundColor: 'transparent'}}>
                          { property.size }
                        </Chip>
                        <Chip elevation={0} icon="hotel" selectedColor='#787878' style={{backgroundColor: 'transparent'}}>
                          { property.dorms }
                        </Chip>
                        <Chip elevation={0} icon="hot-tub" selectedColor='#787878' style={{backgroundColor: 'transparent'}}>
                          { property.dorms }
                        </Chip>
                      </View>
                  </View>
                </Ripple>
              </Card>
            )) }

          </ScrollView>  

        </View>
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7159C1',
    transform: [{ scale: 0.8 }],
  }
});

const mapStateToProps = state => ({
  auth: state.authReducers,
  properties: state.propertiesReducers
});

const mapDispatchToProps = dispatch => bindActionCreators({...AuthActions, ...PropertiesActions}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);