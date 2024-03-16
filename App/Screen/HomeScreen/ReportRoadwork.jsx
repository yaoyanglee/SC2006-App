import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserLocationContext } from '../../Context/UserLocationContext';
import { app } from '../../Utils/FirebaseConfig'; //Firebase config
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 

const database = getFirestore(app);

const ReportRoadwork = () => {
  const { location } = useContext(UserLocationContext);

  const reportRoadwork = async () => {
    const roadworkLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      type: 'roadwork', // Add a type to identify roadwork markers
    };

    try {
        // Add the location to the 'speed_snipers' collection in Firestore
        await addDoc(collection(database, 'roadwork'), roadworkLocation);
        console.log('Roadwork reported successfully:', roadworkLocation);
      } catch (error) {
        console.error('Error reporting Roadwork:', error);
      }
  };

  return (
    <TouchableOpacity style={styles.reportButton} onPress={reportRoadwork}>
      <Text style={styles.reportButtonText}>Report Roadwork</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reportButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 30,
    marginVertical: 5, //the gap between ReportSpeedSniper and this button
    width: '35%', // Set the width to 35% of the search bar
    alignSelf: 'flex-end', // Align the button to the right
  }, 
  reportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 11, //font size of "Report Roadwork"
  },
});

export default ReportRoadwork;
