import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../Utils/Colors';

import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import FavouriteScreen from '../Screen/FavouriteScreen/FavouriteScreen';
import ProfileScreen from '../Screen/ProfileScreen/ProfileScreen';

import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator(); 
export default function TabNavigation() {
  // console.log("User Location: ", userLocation)

  return (
    // Option to remove header
    <Tab.Navigator screenOptions={{headerShown:false}}>
        <Tab.Screen name='Home' component={HomeScreen} options={{
            tabBarLabel:'Search',
            tabBarActiveTintColor:Colors.PRIMARY,
            tabBarIcon:({color, size}) => (<Ionicons name="search" size={size} color={color} />)
        }}/>
        <Tab.Screen name='Favourites' component={FavouriteScreen} options={{
            tabBarActiveTintColor: Colors.PRIMARY,
            tabBarIcon:({color, size}) => (<Ionicons name="heart" size={size} color={color} />)
        }}/>
        <Tab.Screen name='Profile' component={ProfileScreen} options={{
            tabBarActiveTintColor: Colors.PRIMARY,
            tabBarIcon:({color, size}) => (<AntDesign name="user" size={size} color={color} />)
        }}/>
    </Tab.Navigator>
  )
}