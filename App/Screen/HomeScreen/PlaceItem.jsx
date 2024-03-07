import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import Colors from '../../Utils/Colors'
import GlobalApi from '../../Utils/GlobalApi';

import { FontAwesome6 } from '@expo/vector-icons';

export default function PlaceItem({place}) {
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";

  return (
    <View
        style={{
            backgroundColor: Colors.WHITE,
            margin:5,
            borderRadius: 10,
            width:Dimensions.get('screen').width*0.9,
            paddingRight: 5,
            paddingLeft: 5
        }}
    >
        {/* Displays google map images of the carpark if available. Else we use a default image */}
        <Image source={place?.photos ? {uri: PLACE_PHOTO_BASE_URL+place.photos[0]?.name + "/media?key=" + GlobalApi.API_KEY + "&maxHeightPx=800&maxWidthPx=1200"}  : require('./../../../assets/images/logo.png')} 
      style={{width:'100%', borderRadius: 10, height: 150}}
      />
      <View style={{padding:15}}>
        <Text style={{fontSize: 20, fontFamily:'outfit-medium'}}>{place?.displayName?.text}</Text>
        <Text style={{color:Colors.GRAY, fontFamily:'outfit'}}>{place?.shortFormattedAddress}</Text>
        <View style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', marginTop: 10}}>
            <View style={{padding:12, backgroundColor:Colors.PRIMARY, borderRadius: 6, paddingHorizontal: 14}}>
                <FontAwesome6 name="location-arrow" size={24} color="black" />
            </View>
        </View>
      </View>
    </View>
  )
}