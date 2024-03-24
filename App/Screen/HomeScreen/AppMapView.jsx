import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useContext, useEffect, useState } from "react";

// For customization of the google maps go to
// https://mapstyle.withgoogle.com/
import MapViewStyle from "./../../Utils/MapViewStyle.json";
import { UserLocationContext } from "../../Context/UserLocationContext";
import Markers from "./Markers";
import { RouteContext } from "../../Context/RouteContext";
import { PlaceContext } from "../../Context/PlaceContext";

// For roadworks and speed sniper display:
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../Utils/FirebaseConfig'; // Firebase config
import { Image, Alert } from 'react-native';

const database = getFirestore(app);

// We are updating the placeList using a context instead. Hence this is unused
// REMOVE IN FINAL
export default function AppMapView({ placeList }) {
  const { location, setLocation } = useContext(UserLocationContext);
  //console.log(location?.longitude)

  const { routeCoordinate, setRouteCoordinate } = useContext(RouteContext);
  const { places, setPlaces } = useContext(PlaceContext);

  // Display roadworks and speed snipers
  const [roadworks, setRoadworks] = useState([]);
  const [speedSnipers, setSpeedSnipers] = useState([]);

  // useEffect hook sets up the real-time listeners and return a cleanup 
  // function to unsubscribe from the updates when the component unmounts
  useEffect(() => {
    const unsubscribeRoadworks = fetchRoadworks();
    const unsubscribeSpeedSnipers = fetchSpeedSnipers();
  
    // Cleanup function to unsubscribe from the listeners
    return () => {
      unsubscribeRoadworks();
      unsubscribeSpeedSnipers();
    };
  }, []);

  const fetchRoadworks = () => {
    const unsubscribe = onSnapshot(collection(database, 'roadwork'), (querySnapshot) => {
      const roadworkList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id; // Store the document ID in the data object
        roadworkList.push(data);
      });
      setRoadworks(roadworkList);
    });
    return unsubscribe; // Return the unsubscribe function to stop listening for updates
  };

  const fetchSpeedSnipers = () => {
    const unsubscribe = onSnapshot(collection(database, 'speed_snipers'), (querySnapshot) => {
      const sniperList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id; // Store the document ID in the data object
        sniperList.push(data);
      });
      setSpeedSnipers(sniperList);
    });
    return unsubscribe; // Return the unsubscribe function to stop listening for updates
  };

  // Handles what happened when marker is pressed
  const handleMarkerPress = (markerId, collectionName) => {
    Alert.alert(
      "Remove Report",
      "Is it still there?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Not there", onPress: () => removeMarker(markerId, collectionName) }
      ]
    );
  };
  
  // Allows for removal of markers from firestore
  const removeMarker = async (markerId, collectionName) => {
    const docRef = doc(database, collectionName, markerId);
    await deleteDoc(docRef);
    // Refresh the markers on the map after deletion
    if (collectionName === 'roadwork') {
      fetchRoadworks();
    } else if (collectionName === 'speed_snipers') {
      fetchSpeedSnipers();
    }
  };

  return (
    location?.latitude && (
      <View>
        <MapView
          style={styles.map}
          provider="google"
          showsUserLocation={true}
          customMapStyle={MapViewStyle}
          region={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0421,
          }}
        >
          {/* This section here is responsible for placing the markers on the map, in essence the parking point thing on the map */}
          {places &&
            places.map((item, index) => (
              <Markers key={index} place={item} index={index} />
              // <Marker coordinate={{latitude: item.location?.latitude, longitude: item.location?.longitude}} key={index}/>
            ))}
          {routeCoordinate && (
            <Polyline
              coordinates={routeCoordinate}
              strokeColor="#FF0000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={6}
            />
          )}

          {/*Places roadworks marker on map:*/}
          {roadworks &&
              roadworks.map((roadwork, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: roadwork.latitude,
                    longitude: roadwork.longitude,
                  }}
                  title={"Roadwork"}
                  description={"Roadwork reported here"}
                  // Allows for user to click on icon and remove:
                  onPress={() => handleMarkerPress(roadwork.id, 'roadwork')}
                >
                  <Image
                    source={require('../../../assets/images/roadworkMarker.png')}
                    style={{ width: 30, height: 30 }}
                  />
                </Marker>
              ))
          }
          
          {/*Places speed sniper marker on map:*/}
          {speedSnipers &&
            speedSnipers.map((sniper, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: sniper.latitude,
                  longitude: sniper.longitude,
                }}
                title={"Speed Sniper"}
                description={"Speed sniper reported here"}
                // Allows for user to click on icon and remove:
                onPress={() => handleMarkerPress(sniper.id, 'speed_snipers')}
              >
                <Image
                  source={require('../../../assets/images/sniperMarker.png')}
                  style={{ width: 20, height: 20 }}
                />
              </Marker>
            ))}

        </MapView>
      </View>
    )
  );
}

// IMPORTANT: StyleSheet for the mapview to render
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
