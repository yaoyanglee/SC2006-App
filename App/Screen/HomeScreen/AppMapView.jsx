import {StyleSheet, View, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import React, { useContext } from 'react'

// For customization of the google maps go to
// https://mapstyle.withgoogle.com/
import MapViewStyle from './../../Utils/MapViewStyle.json'
import { UserLocationContext } from '../../Context/UserLocationContext'
import Markers from './Markers'

export default function AppMapView({placeList}) {
    const {location, setLocation} = useContext(UserLocationContext);

    return location?.latitude&&(
        <View>
            <MapView style={styles.map} provider='google' showsUserLocation={true} customMapStyle={MapViewStyle} region={{
                latitude:location?.latitude,
                longitude:location?.longitude,
                latitudeDelta: 0.0422,
                longitudeDelta: 0.0421
            }}> 
            {/* This section here is responsible for placing the markers on the map, in essence the parking point thing on the map */}
              {placeList && placeList.map((item, index) => (
                <Markers key={index} place={item} index={index}/>
                // <Marker coordinate={{latitude: item.location?.latitude, longitude: item.location?.longitude}} key={index}/>
              ))}
            </MapView> 
        </View>
    )
}

// IMPORTANT: StyleSheet for the mapview to render
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

