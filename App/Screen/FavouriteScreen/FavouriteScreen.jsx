import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../Utils/Colors'
import { app } from '../../Utils/FirebaseConfig';
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import PlaceItem from '../HomeScreen/PlaceItem';

export default function FavouriteScreen() {

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const {user} = useUser();
  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    user && getFav();
  }, [user])

  const getFav = async () => {
    setLoading(true);

    // We need to do this to ensure that the list is empty so that we can get the updated list, assuming that the user removes favourites
    setFavList([])

    const q = query(collection(db, "carparks-fav-place"), where("email", "==", user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      setFavList(favList => [...favList, doc.data()]);
      setLoading(false);
    });
  }

  return (
    <SafeAreaView>
        <Text style={{padding: 10, fontFamily: 'outfit-medium', fontSize: 30}}>Favourites</Text>
        {!favList ? <View style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={Colors.PRIMARY}/>
          <Text style={{fontFamily: 'outfit', marginTop: 5}}>Loading...</Text>
        </View> : null }

        {/* ISSUE HERE */}
        <FlatList style={{paddingBottom: 200}} onRefresh={() => getFav()} refreshing={loading} data={favList} renderItem={(item, index) => (
          <PlaceItem place={item.item.place} isFav={true} markedFav={() => getFav()}/>
        )}/>
    </SafeAreaView>
  )
}