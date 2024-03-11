import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserLocationContext } from '../../Context/UserLocationContext';

const ReportSpeedSniper = () => {
  const { location } = useContext(UserLocationContext);

  const reportSpeedSniper = () => {
    const sniperLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      type: 'speed_sniper', // Add a type to identify speed sniper markers
    };

    // TODO: Send this location to Firebase
    // For now, just log it
    console.log('Reporting Speed Sniper at:', sniperLocation);
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
