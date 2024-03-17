import React,{useState,useEffect} from "react";
import { Text, View, StyleSheet } from 'react-native';

export default function GetCurrentEta({routeDuration}){
    const [currentTime, setCurrentTime] = useState(new Date());
    const [eta, setEta] = useState(null);
    routeDuration = parseInt(routeDuration.replace('s', '')); //route duration is string by default
    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => {
          clearInterval(timer);
        };
      }, []);

     
    useEffect(() => {
        if (currentTime && routeDuration) {
          const etaTime = new Date(currentTime.getTime() + routeDuration * 1000); // Convert duration to milliseconds
          setEta(etaTime);
        }
      }, [currentTime, routeDuration]);

    const formatTimeWithoutSeconds = (date) => {  //remove seconds portion in the eta
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString([], options);
      };
    return (
        <View style={styles.container}> 
          {eta && <Text style={styles.timeText}>ETA: {formatTimeWithoutSeconds(eta)}</Text>}
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'left',
    },
    timeText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 0,
      marginLeft: 5,
    },
  });