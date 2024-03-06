import {StyleSheet, View, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import React, { useContext } from 'react'

// For customization of the google maps go to
// https://mapstyle.withgoogle.com/
import MapViewStyle from './../../Utils/MapViewStyle.json'
import { UserLocationContext } from '../../Context/UserLocationContext'

export default function AppMapView() {
    const {location, setLocation} = useContext(UserLocationContext);

    return location?.latitude&&(
        <View>
            <MapView style={styles.map} provider='google' showsUserLocation={true} customMapStyle={MapViewStyle} region={{
                latitude:location?.latitude,
                longitude:location?.longitude,
                latitudeDelta: 0.0422,
                longitudeDelta: 0.0421
            }}/> 
            {/* This is abit redundant will convert to a self closing tag. Re-use in the future if necessary*/}
            {/* <Marker coordinate={{
                latitude:location?.latitude,
                longitude:location?.longitude
            }}/>
            </MapView> */}
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