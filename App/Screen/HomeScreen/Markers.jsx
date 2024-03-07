import { View, Text, Image } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps'

export default function Markers({place}) {
   
  return place && (
    <Marker coordinate={{latitude: place.location?.latitude, longitude: place.location?.longitude}}>
        <Image />
    </Marker>
  )
}