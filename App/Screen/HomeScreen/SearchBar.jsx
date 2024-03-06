import { View, Text } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function SearchBar({searchedLocation}) {
  return (
    <View style={{paddingTop: 10}}>
      <GooglePlacesAutocomplete
      placeholder="Let's get moving!"
      fetchDetails={true}
      enablePoweredByContainer={false}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        // console.log(data, details);
        searchedLocation(details?.geometry?.location)
      }}
      query={{
        key: 'AIzaSyCqCIArKofPSnkELJHVxwhGg5BulASv7LA',
        language: 'en',
      }}
    />
    </View>
  )
}