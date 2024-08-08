import {
    View,
    Text,
    StyleSheet,
    Button,
    Platform,
    ActivityIndicator,
    Pressable,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { BlurView } from "expo-blur";
  import { hp, wp } from "../../helpers/common";
  import { theme } from "../../constants/theme";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { Image } from "expo-image";
  import { Octicons } from "@expo/vector-icons";
  import Animated, { FadeInDown } from "react-native-reanimated";
  import * as FileSystem from "expo-file-system";
  import * as Sharing from "expo-sharing";
  import Toast from "react-native-toast-message";
  
  const ImageScreen = () => {
    const router = useRouter();
    const item = useLocalSearchParams();
    const [status, setStatus] = useState("loading");
    const uri = item?.webformatURL;
    const fileName = item?.previewURL?.split("/").pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
  
    const onLoad = () => {
      setStatus("");
    };
  
    const getSize = () => {
      const aspectRatio = item?.imageWidth / item?.imageHeight;
      console.log("aspectRatio: ", aspectRatio);  
  
      const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
      let calculatedHeight = maxWidth / aspectRatio;
      let calculatedWidth = maxWidth;
  
      if (aspectRatio < 1) {
        // portrait image
        calculatedWidth = calculatedHeight * aspectRatio;
      }
      return { height: calculatedHeight, width: calculatedWidth };
    };
  
    const handleDownloadImage = async () => {
      if (Platform.OS === "web") {
        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.target = "_blank";
        anchor.download = fileName || "download";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        setStatus("downloading");
        let uri = await downloadFile();
        if (uri) showToast("Image Downloaded");
      }
    };
  
    const handleShareImage = async () => {
      if (Platform.OS === "web") {
        showToast("Link Copied to Clipboard");
      } else {
        setStatus("sharing");
        let uri = await downloadFile();
        if (uri) {
          await Sharing.shareAsync(uri);
        }
      }
    };
  
    const downloadFile = async () => {
      try {
        const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
        setStatus("");
        console.log("Finished downloading to ", uri);
        return uri;
      } catch (error) {
        console.log("got error: ", error.message);
        setStatus("");
        Alert.alert("Image: ", error.message);
        return null;
      }
    };
  
    const showToast = (message) => {
      Toast.show({
        type: "success",
        text1: message,
        position: "bottom",
      });
    };
  
    const toastConfig = {
      success: ({ text1, props, ...rest }) => {
        return (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{text1}</Text>
          </View>
        );
      },
    };
  
    return (
      <BlurView style={styles.container} tint="dark" intensity={60}>
        <View style={[getSize()]}>
          <View style={styles.loading}>
            {status === "loading" && (
              <ActivityIndicator size="large" color="white" />
            )}
          </View>
          <Image
            transition={100}
            style={[styles.image, getSize()]}
            source={uri}
            onLoad={onLoad}
          />
        </View>
        <View style={styles.buttons}>
          <Animated.View entering={FadeInDown.springify()}>
            <Pressable style={styles.button} onPress={() => router.back()}>
              <Octicons name="x" size={24} color="white" />
            </Pressable>
          </Animated.View>
          <Animated.View entering={FadeInDown.springify().delay(100)}>
            {status === "downloading" ? (
              <View style={styles.button}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <Pressable style={styles.button} onPress={handleDownloadImage}>
                <Octicons name="download" size={24} color="white" />
              </Pressable>
            )}
          </Animated.View>
          <Animated.View entering={FadeInDown.springify().delay(200)}>
            {status === "sharing" ? (
              <View style={styles.button}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <Pressable style={styles.button} onPress={handleShareImage}>
                <Octicons name="share-android" size={18} color="white" />
              </Pressable>
            )}
          </Animated.View>
        </View>
        <Toast config={toastConfig} visibilityTime={2500} />
      </BlurView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: wp(4),
      backgroundColor: "rgba(0,0,0,0.8)",
    },
    image: {
      borderRadius: theme.radius.lg,
      borderWidth: 2,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 1)",
    },
    loading: {
      position: "absolute",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    buttons: {
      marginTop: 40,
      flexDirection: "row",
      alignItems: "center",
      gap: 50,
    },
    button: {
      height: hp(6),
      width: hp(6),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: theme.radius.lg,
      borderCurve: "continuous",
    },
    toast: {
      padding: 15,
      paddingHorizontal: 30,
      borderRadius: theme.radius.xl,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    toastText: {
      fontSize: hp(1.8),
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.white,
    },
  });
  
  export default ImageScreen;