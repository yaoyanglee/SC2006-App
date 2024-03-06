import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'

import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';

export default function Header() {
    // We can use this to get all user data, such as ID, name, etc
    // Follow this syntax and import Line 3 to ensure that everything works
    const {user} = useUser();
    // console.log(user.id)

    return (
    <View style={styles.container}>
      <Image source={{uri:user?.imageUrl}} style={{width:45, height:45, borderRadius: 99}}/>
      <Image source={require('./../../../assets/images/waze-logo-png-transparent.png')} style={{width: 200, height: 45, objectFit: 'contain'}}/>
      <FontAwesome name="filter" size={26} color="black" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})
