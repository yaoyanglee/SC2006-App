import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UserLocationContext } from '../../Context/UserLocationContext'

import AppMapView from './AppMapView' 
import Header from './Header'
import SearchBar from './SearchBar'
import GlobalApi from './../../Utils/GlobalApi'
import PlaceListView from './PlaceListView'
import { SelectMarkerContext } from '../../Context/SelectedMarkerContext'

export default function HomeScreen() {
  const {location, setLocation} = useContext(UserLocationContext);
  const [placeList, setPlaceList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);

  // The useEffect gets the nearby places, in our case carparks and EV charging points (video tutorial).
  // useEffect basically runs the function in the background. And can execute multiple times as users use the app
  useEffect(() => {
    location&&GetNearByPlace();
  }, [location])

  // This sends the type of data that we want to search for. Such as parking. 
  // It also defines the search radius from the user's current location.
  const GetNearByPlace = () => {
    const data = {
      // ["electric_vehicle_charging_station", "parking"]
      "includedTypes": ["parking"],
      "maxResultCount": 10,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": location?.latitude,
            "longitude": location?.longitude},
          "radius": 750.0
        }
      }
    }

    // We make a request to the API to get the google maps data from the API
    // JSON.stringify can be removed
    GlobalApi.NewNearByPlace(data).then(resp => {
      console.log(JSON.stringify(resp.data));
      setPlaceList(resp.data?.places);
    })
  }

  return (
    <SelectMarkerContext.Provider value={{selectedMarker, setSelectedMarker}}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <Header />
          {/* Here we basically find the carparks that are near the searched locations that the users have input. The default, aka on app launch, the nearby carparks are displayed first */}
          {/* console.log(location) */}
          <SearchBar searchedLocation={(location)=>setLocation({latitude: location.lat, longitude: location.lng})}/>
        </View>
        
        <AppMapView placeList={placeList}/>
        <View style={styles.placeListContainer}>
          {placeList&&<PlaceListView placeList={placeList}/>}
        </View>
      </SafeAreaView>
    </SelectMarkerContext.Provider>
    
    
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    zIndex: 10,
    padding: 10,
    paddingTop: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%'
  }
})
