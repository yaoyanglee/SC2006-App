import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserLocationContext } from '../../Context/UserLocationContext';
import { app } from '../../Utils/FirebaseConfig'; //Firebase config
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'; 

const database = getFirestore(app);

const isWithinRadius = (newLocation, existingLocations, radius) => {
  for (let i = 0; i < existingLocations.length; i++) {
    const existingLocation = existingLocations[i];
    const distance = getDistance(
      { latitude: newLocation.latitude, longitude: newLocation.longitude },
      { latitude: existingLocation.latitude, longitude: existingLocation.longitude }
    );
    if (distance <= radius) {
      return true; // Within radius, no need to add new marker
    }
  }
  return false; // Not within radius of any existing markers
};

// Function to calculate the distance between two coordinates in meters
const getDistance = (coord1, coord2) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in meters
  const dLat = rad(coord2.latitude - coord1.latitude);
  const dLon = rad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(coord1.latitude)) *
      Math.cos(rad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};


const ReportSpeedSniper = () => {
  const { location } = useContext(UserLocationContext);

  const reportSpeedSniper = async () => {
    const sniperLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      type: 'speed_sniper', // Add a type to identify speed sniper markers
    };

    // Fetch existing speed sniper locations
    const querySnapshot = await getDocs(collection(database, 'speed_snipers'));
    const existingSnipers = [];
    querySnapshot.forEach((doc) => {
      existingSnipers.push(doc.data());
    });

    // Check if the new location is within the specified radius of any existing speed sniper markers
    const radius = 50; // Set the radius in meters CHANGE THIS THRESHOLD
    if (!isWithinRadius(sniperLocation, existingSnipers, radius)) {
      try {
        // Add the location to the 'speed_snipers' collection in Firestore
        await addDoc(collection(database, 'speed_snipers'), sniperLocation);
        console.log('Speed Sniper reported successfully:', sniperLocation);
      } catch (error) {
        console.error('Error reporting Speed Sniper:', error);
      }
    } else {
      console.log('Speed Sniper location is within the radius of an existing marker, not added.');
    }
  };

  return (
    <TouchableOpacity style={styles.reportButton} onPress={reportSpeedSniper}>
      <Text style={styles.reportButtonText}>Report Speed Sniper</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reportButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
    //marginVertical: 2, //the gap between search bar and this button
    width: '35%', // Set the width to 35% of the search bar
    alignSelf: 'flex-end', // Align the button to the right
  }, 
  reportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 11, //font size of "Report Speed Sniper"
  },
});

export default ReportSpeedSniper;
