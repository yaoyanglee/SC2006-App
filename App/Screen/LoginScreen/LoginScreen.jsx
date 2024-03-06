import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity} from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../../hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";

import Colors from "../../Utils/Colors";

WebBrowser.maybeCompleteAuthSession();

export default function loginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Setting up onPress functionality for OAuth authentication using gmail. 
  // Used in the login button as a callback function
  const onPress = async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
 
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }

  return (
    <SafeAreaView>
      {/* Defining and styling the logo and image for aesthetics */}
      <View style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
      }}>
        <Image source={require('./../../../assets/images/waze-logo-png-transparent.png')} 
          style={styles.logoImage}
        />
        <Image source={require('./../../../assets/images/login-logo.jpg')}
          style={styles.bgImage}
        />
        {/* Component for the headings, description and login button */}
        <View style={{padding:20}}>
          <Text style={styles.heading}>Your ultimate navigation App</Text>
          <Text style={styles.desc}>Find, travel and park with ease!</Text>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={{color: Colors.WHITE, textAlign:'center', fontFamily:'outfit', fontSize:17}}>Login with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// StyleSheets object. Similar to Python dictionary
const styles = StyleSheet.create({
  logoImage:{
    width: 200,
    height: 40,
    objectFit:'contain'
  },
  bgImage: {
    width: '100%',
    height: 240,
    marginTop: 20,
    objectFit: 'cover'
  },
  heading:{
    fontSize: 25,
    fontFamily: 'outfit-bold',
    textAlign:'center',
    marginTop: 20
  },
  desc: {
    fontSize: 17,
    fontFamily: 'outfit',
    marginTop: 15,
    textAlign: 'center',
    color: Colors.GRAY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    display: 'flex',
    borderRadius: 99,
    marginTop: 40
  }
})

