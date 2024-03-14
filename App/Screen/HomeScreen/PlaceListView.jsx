import { View, Text, FlatList, Dimensions } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import PlaceItem from "./PlaceItem";
import { SelectMarkerContext } from "../../Context/SelectedMarkerContext";

import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { app } from "../../Utils/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

export default function PlaceListView({ placeList }) {
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  // Store favourites list
  const [favList, setFavList] = useState([]);

  // console.log("***", placeList)
  const flatListRef = useRef(null);
  const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);

  // Move the FlatList scrolling to the selected item
  useEffect(() => {
    selectedMarker > 0 && scrollToIndex(selectedMarker);
  }, [selectedMarker]);

  const scrollToIndex = (index) =>
    flatListRef.current?.scrollToIndex({ animated: true, index });

  const getItemLayout = (_, index) => ({
    length: Dimensions.get("window").width,
    offset: Dimensions.get("window").width * index,
    index,
  });

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  useEffect(() => {
    user && getFav();
  }, [user]);

  const getFav = async () => {
    setLoading(true);

    // We need to do this to ensure that the list is empty so that we can get the updated list, assuming that the user removes favourites
    setFavList([]);

    const q = query(
      collection(db, "carparks-fav-place"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      setFavList((favList) => [...favList, doc.data()]);
    });
    // Shifted setLoading out of the forEach loop
    setLoading(false);
  };

  // Check if a carpark is considered a favourite
  const isFav = (place) => {
    const result = favList.find((item) => item.place.id == place.id);
    return result ? true : false;
  };

  return (
    <View>
      <FlatList
        onRefresh={() => getFav()}
        refreshing={loading}
        data={placeList}
        horizontal={true}
        pagingEnabled
        ref={flatListRef}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View index={index}>
            {/* You need a key for multiple items */}
            {/* <Text key={index}> */}
            <PlaceItem
              place={item}
              isFav={isFav(item)}
              markedFav={() => getFav()}
            />
            {/* </Text>  */}
          </View>
        )}
      />
    </View>
  );
}
