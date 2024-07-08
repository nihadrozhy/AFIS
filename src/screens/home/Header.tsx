import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'react-native';

export default function Header({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor='#FDFDFD'
        barStyle={'dark-content'}
      />
      <View style={{ flex: 1, marginLeft: 20 }} />
      
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Text>Notifications</Text>
        </TouchableOpacity>
      
      </View>
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // height: 96,
    height: Platform.OS === 'ios' ? 96 : 60,
    width: '100%',
    alignItems: 'flex-end',
    backgroundColor: '#FDFDFD',
    flexDirection: 'row',    
  },
  logo: {
    height: 30,
    width: 120,
  },
  icons: {
    height: 30,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1
  },
});
