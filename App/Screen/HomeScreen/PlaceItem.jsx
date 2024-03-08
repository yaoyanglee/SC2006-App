import { View, Text, Image, Dimensions, Pressable, Platform, ToastAndroid, Alert } from 'react-native'
import React from 'react'
import Colors from '../../Utils/Colors'
import GlobalApi from '../../Utils/GlobalApi';
import { app } from '../../Utils/FirebaseConfig';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

import { deleteDoc, getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import { useUser } from '@clerk/clerk-expo';

export default function PlaceItem({place, isFav, markedFav}) {
  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";

  // Getting user info to populate the database
  const {user} = useUser();

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // This feature is extensible to other functionality namely the Report RoadWorks and Report SpeedSniper
  // Place is the JSON data containing the place information
  // PS. The "?" is to set the data to be optional
  const onSetFav = async (place) => {
    await setDoc(doc(db, "carparks-fav-place", (place.id).toString()), {place: place, email: user?.primaryEmailAddress?.emailAddress});

    markedFav()

    // The error with the FlatList seems to occur after I add the favourites 
    // Need to debug this
    // The item is getting bigger and bigger the longer you hold. Might be a styling issue
    if (Platform.OS === 'android') {
      ToastAndroid.show("Favourite added!", ToastAndroid.TOP);
    } else {
      Alert.alert("Favourite added!");
    }
  }

  const onRemoveFav = async (placeId) => {
    await deleteDoc(doc(db, "carparks-fav-place", placeId.toString()));

    // The error with the FlatList seems to occur after I add the favourites 
    // Need to debug this
    if (Platform.OS === 'android') {
      ToastAndroid.show("Favourite removed!", ToastAndroid.TOP);
    } else {
      Alert.alert("Favourite removed!");
    }  
    markedFav();
  }

  // Fill in the code for routing via the routes API and placing the route onto the map
  const onDirectionClick = () => {
    console.log("OnDirectionClick!");
  }

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
      <View>
        <Text style={{fontSize: 20, fontFamily:'outfit-medium'}}>{place?.displayName?.text}</Text>
        <Text style={{color:Colors.GRAY, fontFamily:'outfit'}}>{place?.shortFormattedAddress}</Text>
        <View style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', marginTop: 10}}>
            <Pressable onPress={() => onDirectionClick()} style={{padding:12, backgroundColor:Colors.PRIMARY, borderRadius: 6, paddingHorizontal: 14}}>
                <FontAwesome6 name="location-arrow" size={24} color="black" />
            </Pressable>
        </View>
      </View>
      {/* Only change heart icon depending if the item is favourited or not */}
      {!isFav ? <Pressable style={{position: 'absolute', right:0, margin: 7}} onPress={() => onSetFav(place)}>
        <Ionicons name="heart-outline" size={24} color="white" /> 
      </Pressable> 
      :
      <Pressable style={{position: 'absolute', right:0, margin: 7}} onPress={() => onRemoveFav(place.id)}>
        <Ionicons name="heart-sharp" size={24} color="red" />
      </Pressable> }
    </View>
  )
}