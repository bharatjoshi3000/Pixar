import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    TextInput,
    ActivityIndicator,
  } from "react-native";
  import React, { useCallback, useEffect, useRef, useState } from "react";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
  import { theme } from "../../constants/theme";
  import { hp, wp } from "../../helpers/common";
  import Catagories from "../../components/categories";
  import { apiCall } from "../../api";
  import ImageGrid from "../../components/imagegrid";
  import FiltersModel from "../../components/filterModals";
  import { debounce, set } from "lodash";
  import { useRouter } from "expo-router";
  
  var page = 1;
  
  const HomeScreen = () => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState("");
    const [images, setImages] = useState([]);
    const [filters, setFilters] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const searchInputRef = useRef(null);
    const modelRef = useRef(null);
    const scrollRef = useRef(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      fetchImages();
    }, []);
  
    const fetchImages = async (params = { page: 1 }, append = true) => {
      console.log("params: ", params, append);
      let response = await apiCall(params);
      if (response.success && response?.data?.hits) {
        if (append) {
          setImages([...images, ...response.data.hits]);
        } else {
          setImages([...response.data.hits]);
        }
      }
    };
  
    const handleChangeCategory = (category) => {
      setActiveCategory(category);
      clearSearch();
      setImages([]);
      page = 1;
      let params = { page, ...filters };
      if (category) params.category = category;
      fetchImages(params, false);
    };
  
    const handleSearch = (text) => {
      setSearch(text);
      if (text.length > 2) {
        //search for this text
        page = 1;
        setImages([]);
        setActiveCategory(null); // clear category when searching
        fetchImages({ page, q: text, ...filters }, false);
      }
  
      if (text == "") {
        page = 1;
        searchInputRef?.current?.clear();
        setImages([]);
        setActiveCategory(null); // clear category when searching
        fetchImages({ page, ...filters }, false);
      }
    };
  
    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  
    const clearSearch = () => {
      setSearch("");
    };
  
    const openFilterModal = () => {
      modelRef?.current?.present();
    };
  
    const closeFilterModal = () => {
      modelRef?.current?.close();
    };
  
    const applyFilters = () => {
      if (filters) {
        page = 1;
        setImages([]);
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false);
      }
      closeFilterModal();
    };
  
    const resetFilters = () => {
      if (filters) {
        page = 1;
        setFilters(null);
        setImages([]);
        let params = {
          page,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false);
      }
      closeFilterModal();
    };
  
    const clearThisFilter = (filterName) => {
      let newFilters = { ...filters };
      delete newFilters[filterName];
      setFilters({ ...newFilters });
      page = 1;
      setImages([]);
      let params = {
        page,
        ...newFilters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params);
    };
  
    const handleScrollUp = () => {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });
    };
  
    const handleScroll = (event) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      const scrollOffset = event.nativeEvent.contentOffset.y;
      const bottomPosition = contentHeight - scrollViewHeight;
  
      if (scrollOffset >= bottomPosition - 1) {
        if (!isEndReached) {
          setIsEndReached(true);
          console.log("reach to the bottom");
          // fetch more images
          ++page;
          let params = { page, ...filters };
          if (activeCategory) params.category = activeCategory;
          if (search) params.q = search;
          fetchImages(params, true);
        }
      } else if (isEndReached) { 
        setIsEndReached(false);
      }
    };
  
    return (
      <View style={[styles.container, { paddingTop }]}>
        {/* header */}
        <View style={styles.header}>
          <Pressable onPress={handleScrollUp}>
            <Text style={styles.title}>Pixar</Text>
          </Pressable>
          <Pressable onPress={openFilterModal}>
            <FontAwesome6
              name="bars-staggered"
              size={22}
              color={theme.colors.neutral(0.7)}
            />
          </Pressable>
        </View>
  
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={5} // how often we should listen to scroll events
          ref={scrollRef}
          contentContainerStyle={{ gap: 15 }}
        >
          {/* search bar */}
          <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
              <Feather
                name="search"
                size={24}
                color={theme.colors.neutral(0.4)}
              />
            </View>
            <TextInput
              placeholder="Search for Images"
              // value={search}
              ref={searchInputRef}
              onChangeText={handleTextDebounce}
              style={styles.searchInput}
            />
            {search && (
              <Pressable
                onPress={() => handleSearch("")}
                style={styles.closeIcon}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.neutral(0.6)}
                />
              </Pressable>
            )}
          </View>
  
          {/* categories */}
          <View style={styles.catagories}>
            <Catagories
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          </View>
  
          {/* filters */}
          {filters && (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
              >
                {Object.keys(filters).map((key, index) => {
                  return (
                    <View key={key} style={styles.filterItem}>
                      {key === "colors" ? (
                        <View
                          style={{
                            width: 30,
                            height: 20,
                            backgroundColor: filters[key],
                            borderRadius: 7,
                          }}
                        />
                      ) : (
                        <Text style={styles.filterItemText}>{filters[key]}</Text>
                      )}
                      <Pressable
                        style={styles.filterCloseIcon}
                        onPress={() => clearThisFilter(key)}
                      >
                        <Ionicons
                          name="close"
                          size={14}
                          color={theme.colors.neutral(0.9)}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
  
          {/* images masonry grid */}
          <View>{images.length > 0 && <ImageGrid images={images} router={router} />}</View>
  
          {/* loading */}
          <View
            style={{ marginBottom: 20, marginTop: images.length > 0 ? 10 : 70 }}
          >
            <ActivityIndicator size="large" color={theme.colors.neutral(0.5)} />
          </View>
        </ScrollView>
  
        {/* filter model */}
        <FiltersModel
          modelRef={modelRef}
          filters={filters}
          setFilters={setFilters}
          onClose={closeFilterModal}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: 15,
    },
    header: {
      marginHorizontal: wp(4),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: hp(4),
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.neutral(0.9),
    },
    searchBar: {
      marginHorizontal: wp(4),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.grayBG,
      backgroundColor: theme.colors.white,
      padding: 6,
      paddingLeft: 10,
      borderRadius: theme.radius.lg,
    },
    searchIcon: {
      padding: 8,
    },
    searchInput: {
      flex: 1,
      borderRadius: theme.radius.sm,
      paddingVertical: 10,
      fontSize: hp(1.8),
    },
    closeIcon: {
      backgroundColor: theme.colors.grayBG,
      padding: 8,
      borderRadius: theme.radius.sm,
    },
    filters: {
      paddingHorizontal: wp(4),
      gap: 10,
    },
    filterItem: {
      backgroundColor: theme.colors.grayBG,
      // padding: 3,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: theme.radius.sm,
      padding: 8,
      gap: 10,
      paddingHorizontal: 10,
    },
    filterItemText: {
      fontSize: hp(1.9),
    },
    filterCloseIcon: {
      backgroundColor: theme.colors.neutral(0.2),
      padding: 4,
      borderRadius: 7,
    },
  });
  
  export default HomeScreen;