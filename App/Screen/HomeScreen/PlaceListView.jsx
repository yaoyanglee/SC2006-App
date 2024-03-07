import { View, Text, FlatList } from 'react-native'
import React from 'react'
import PlaceItem from './PlaceItem'

export default function PlaceListView({placeList}) {
    // console.log("***", placeList)
    return (
    <View>
      <FlatList 
        data={placeList} 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
            <View>
                {/* You need a key for multiple items */}
                <Text key={index}>
                    <PlaceItem place={item}/>
                </Text> 
            </View>
        )}
        />
    </View>
  )
}