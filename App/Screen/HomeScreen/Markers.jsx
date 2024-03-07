import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { Marker } from 'react-native-maps'
import { SelectMarkerContext } from '../../Context/SelectedMarkerContext'

export default function Markers({place, index}) {
  const {selectedMarker, setSelectedMarker} = useContext(SelectMarkerContext);

  return place && (
    <Marker coordinate={{latitude: place.location?.latitude, longitude: place.location?.longitude}} onPress={()=>setSelectedMarker(index)}>
       <Image source={require('./../../../assets/images/carparkMarker.png')} style={{width: 40, height: 40}}/>
    </Marker>
  )
}