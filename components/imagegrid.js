import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./imageCard";
import { getColumnCount, wp } from "../helpers/common";

const ImageGrid = ({ images, router }) => {

  const columns  = getColumnCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender= {1000}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => <ImageCard router={router} item={item} columns={columns} index={index} />}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 3,
        width: wp(100)
    },
    listContainerStyle: {
      paddingHorizontal: wp(4)
    }
});

export default ImageGrid;