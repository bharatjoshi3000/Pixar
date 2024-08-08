import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { capitalize } from "lodash";

const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {

const onSelect = (item) => {
    setFilters({ ...filters, [filterName]: item });
}

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
            let isActive = filters && filters[filterName] === item;
            let backgroundColor = isActive ? theme.colors.black : 'white';
            let color = isActive ? 'white' : theme.colors.black;
          return (
            <Pressable onPress={() => onSelect(item)} key={item} style={[styles.outlinedButton, {backgroundColor}]}>
              <Text style={[styles.outlinedButtonText, {color}]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilterRow = ({ data, filterName, filters, setFilters }) => {

    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item });
    }
    
      return (
        <View style={styles.flexRowWrap}>
          {data &&
            data.map((item, index) => {
                let isActive = filters && filters[filterName] === item;
                let borderColor = isActive ? theme.colors.black : 'white';
              return (
                <Pressable onPress={() => onSelect(item)} key={item}>
                  <View style={[styles.colorWraper, {borderColor}]}>
                    <View style={[styles.color, {backgroundColor: item}]} />
                  </View>
                </Pressable>
              );
            })}
        </View>
      );
    };

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  outlinedButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: theme.radius.xs,
    dorderCurve: "continuous",
    backgroundColor: theme.colors.grayBG,
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm-3,
    borderCurve: "continuous",
  },
  colorWraper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderCurve: "continuous",
  }
});

export default SectionView;