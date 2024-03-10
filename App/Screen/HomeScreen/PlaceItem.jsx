import { View, Text, Image, Dimensions, Pressable, Platform, ToastAndroid, Alert, Modal, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colors from '../../Utils/Colors'
import GlobalApi from '../../Utils/GlobalApi';
import { app } from '../../Utils/FirebaseConfig';
import { UserLocationContext } from '../../Context/UserLocationContext'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { deleteDoc, getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import polyline from '@mapbox/polyline'
import MapView, { Polyline } from 'react-native-maps';
import routesAPI from '../../Utils/routesAPI';


export default function PlaceItem({ place, isFav, markedFav }) {
  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";

  // Getting user info to populate the database
  const { user } = useUser();

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // This feature is extensible to other functionality namely the Report RoadWorks and Report SpeedSniper
  // Place is the JSON data containing the place information
  // PS. The "?" is to set the data to be optional
  const onSetFav = async (place) => {
    await setDoc(doc(db, "carparks-fav-place", (place.id).toString()), { place: place, email: user?.primaryEmailAddress?.emailAddress });

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
    // console.log("favourite added");
    markedFav();
  }
 
  const { location } = useContext(UserLocationContext); //get user's current location
  const [Routes, setRoutes] = useState([]); //Store Routes
  //const [decodedPolyline, setDecodedPolyline] = useState([]);
  const getRoutes = (place) => {
    const data = {
      "origin": {
        "location": {
          "latLng": {
            "latitude": location?.latitude,  //User's current location
            "longitude": location?.longitude
          }
        }
      },
      "destination": {
        "location": {
          "latLng": {
            "latitude": place?.location.latitude, //Location of the Carpark places
            "longitude": place?.location.longitude
          }
        }
      },
      "travelMode": "DRIVE",
      "extraComputations": ["TOLLS"],
      "routingPreference": "TRAFFIC_AWARE",
      "computeAlternativeRoutes": true,
      "routeModifiers": {
        "vehicleInfo":{
          "emissionType": "GASOLINE"
        },
        "tollPasses": [
          "US_MA_EZPASSMA",
          "US_WA_GOOD_TO_GO"
        ],
        "avoidTolls": false,
        "avoidHighways": false,
        "avoidFerries": false
      },
      "languageCode": "en-US",
      "units": "IMPERIAL"
    };
    //We make a request to the API to get the google routes data from the API
    routesAPI.calculateRoutes(data).then(resp => {
      console.log('Request data:', JSON.stringify(resp.data)); //to check the output data 
      //console.log(place?.location.longitude);
      try {
        const routes = resp.data.routes;
        if (routes && routes.length > 0) {
          setRoutes(routes); //store all the routes + alternative routes
          //const encodedPolyline = routes[0].polyline.encodedPolyline; 
          // const decodedCoordinates = polyline.decode(encodedPolyline);
          // const coordinates = decodedCoordinates.map(([latitude, longitude]) => ({
          //   latitude,
          //   longitude,
          // }));
          // setDecodedPolyline(coordinates);
          setModalVisible(true); //to show the modal with the routes selection
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      }
    })
  }
  const onDirectionClick = (place) => {  //get Route Selection for user to choose Routes
    getRoutes(place);
  };
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        margin: 5,
        borderRadius: 10,
        width: Dimensions.get('screen').width * 0.9,
        paddingRight: 5,
        paddingLeft: 5
      }}
    >
      {/* Displays google map images of the carpark if available. Else we use a default image */}
      <Image source={place?.photos ? { uri: PLACE_PHOTO_BASE_URL + place.photos[0]?.name + "/media?key=" + GlobalApi.API_KEY + "&maxHeightPx=800&maxWidthPx=1200" } : require('./../../../assets/images/logo.png')}
        style={{ width: '100%', borderRadius: 10, height: 150 }}
      />
      <View>
        <Text style={{ fontSize: 20, fontFamily: 'outfit-medium' }}>{place?.displayName?.text}</Text>
        <Text style={{ color: Colors.GRAY, fontFamily: 'outfit' }}>{place?.shortFormattedAddress}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <Pressable onPress={() => onDirectionClick(place)} style={{ padding: 12, backgroundColor: Colors.PRIMARY, borderRadius: 6, paddingHorizontal: 14 }}>
            <FontAwesome6 name="location-arrow" size={24} color="black" />
          </Pressable>
        </View>
      </View>
      {/* Only change heart icon depending if the item is favourited or not */}
      {!isFav ? <Pressable style={{ position: 'absolute', right: 0, margin: 7 }} onPress={() => onSetFav(place)}>
        <Ionicons name="heart-outline" size={24} color="white" />
      </Pressable>
        :
        <Pressable style={{ position: 'absolute', right: 0, margin: 7 }} onPress={() => onRemoveFav(place.id)}>
          <Ionicons name="heart-sharp" size={24} color="red" />
        </Pressable>}
      {/* To show routes selection to Users*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please Select Your Route to this Car Park</Text>
            {Routes.map((route, index) => (
              <View key={index} style={styles.routeContainer}>
                <Text style={styles.routeText}>Route {index + 1}</Text>
                <Text style={styles.routeText}>Duration: {route.duration}</Text>
                <Text style={styles.routeText}>Distance: {route.distanceMeters} meters</Text>
                <Pressable
                  style={[styles.buttonClose]}
                  onPress={() => {
                    // need to add logic where after user clicks start, a route will be drawn (Still stuck atm)
                    console.log("Start button pressed for route", index + 1);
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.textStyle}>Start</Text>
                </Pressable>
                {index < Routes.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'flex-start',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  routeContainer: {
    width: '100%', // Ensure the container takes up the full width
    paddingVertical: 0, // Add padding to make it look better
  },
  routeText: {
    fontSize: 16, // Adjust the font size as needed
    color: 'black', // Set the text color
    marginLeft: 5, // Add some space before the text starts
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    width: '100%', // Ensure the separator line spans the width
    marginTop: 10, // Space above the separator
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    padding: 10,
    elevation: 2,
    alignSelf: 'right', // Center the button within its container
    borderRadius: 20,
    marginTop: 10, // Additional space from the last route item
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15, // Space between the title and the first route item
  }
});