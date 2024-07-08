import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function Splash({ navigation }: any) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('TabsMenu');
    }, 2000);
  });

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="black"
        barStyle={'default'}
      />
      <Text style={styles.text}>AFIS</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontWeight: '800',
    fontSize: 30,
    color: 'white',
  },
});
