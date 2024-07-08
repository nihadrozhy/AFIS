import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';

import MapView, { Marker } from 'react-native-maps';
import { Flight } from '../../models';
import { addFlightDetails, removeFlightDetails } from '../../redux/slice/flightDetailsSlice';
import { RootState } from '../../redux/store/store';

interface Props {
  navigation: any;
  route: any;
}

const FlightDetails: React.FC<Props> = ({ navigation, route }) => {
  const { height } = useWindowDimensions();
  const { itemNew } = route.params;
  const dispatch = useDispatch();
  const flights = useSelector((state: RootState) => state.flightDetails.flights);
  const [isFlight, setIsFlight] = useState<boolean>(false);

   const region = {
    latitude: itemNew.latitude,
    longitude: itemNew.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }; 

  const showAlertSaveFlight = () => {
    Alert.alert(
      'Success',
      'You have saved this flight details in My Flights!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };

  const showAlertRemoveFlight = () => {
    Alert.alert(
      'Success',
      'You have remove this flight details from My Flights!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };

  const isFlightInStorage = async () => {
    const jsonFlightData = await AsyncStorage.getItem('flightData');
    if (jsonFlightData !== null) {
      const flightsFromAsyncStorage = JSON.parse(jsonFlightData) as Flight[];
      const foundFlight = flightsFromAsyncStorage.find((flight) => flight.flightNumber === itemNew.flightNumber);
      setIsFlight(!!foundFlight);
    }
  };

  const storeFlightDataInAsyncStorage = async (data: Flight) => {
    try {
      const updatedFlights = [...flights, data];
      await AsyncStorage.setItem('flightData', JSON.stringify(updatedFlights));
      dispatch(addFlightDetails(data));
      setIsFlight(true);
      showAlertSaveFlight();
      console.log('Flight data stored successfully');
    } catch (error) {
      console.error('Failed to store flight data:', error);
    }
  };

  const removeFlightFromAsyncStorage = async () => {
    try {
      const updatedFlights = flights.filter((flight: Flight) => flight.flightNumber !== itemNew.flightNumber);
      await AsyncStorage.setItem('flightData', JSON.stringify(updatedFlights));
      dispatch(removeFlightDetails(itemNew.flightNumber));
      setIsFlight(false);
      showAlertRemoveFlight();
      console.log('Flight removed successfully');
    } catch (error) {
      console.error('Failed to remove flight:', error);
    }
  };

  useEffect(() => {
    isFlightInStorage();
    console.log('flights')
    console.log(itemNew)

  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StatusBar animated={true} backgroundColor="#F1EFEF" barStyle={'dark-content'} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.replace('TabsMenu')}>
            <Text style={styles.textHeader}>BACK</Text>
          </TouchableOpacity>
          <View style={styles.rowReverse}>
            {isFlight ? (
              <TouchableOpacity onPress={removeFlightFromAsyncStorage}>
                <Text style={styles.textHeader}>REMOVE FLIGHT</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => storeFlightDataInAsyncStorage(itemNew)}>
                <Text style={styles.textHeader}>SAVE FLIGHT</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <ScrollView style={[styles.scrollView, { maxHeight: height / 2 - (Platform.OS === 'ios' ? 84 : 48) }]}>
        <Text style={styles.title}>Flight details</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.subtitle}>From:</Text>
            <Text style={styles.info}>{itemNew.from}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtitle}>To:</Text>
            <Text style={styles.info}>{itemNew.to}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title1}>Aircraft Type</Text>
          <View style={styles.row}>
            <Text style={styles.subtitle}>Registration:</Text>
            <Text style={styles.info}>N41135</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtitle}>IATA:</Text>
            <Text style={styles.info}>752</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtitle}>ICAO:</Text>
            <Text style={styles.info}>B752</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtitle}>ICAO24:</Text>
            <Text style={styles.info}>738092</Text>
          </View>
        </View>
      </ScrollView>
       <MapView style={[styles.map, { marginTop: height / 2 }]} initialRegion={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Your Location" description="This is your location" />
      </MapView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FDFDFD',
  },
  header: {
    display: 'flex',
    paddingBottom: 4,
    height: Platform.OS === 'ios' ? 84 : 48,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#F1EFEF',
  },
  headerRow: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    left: 17,
    right: 33,
    height: 26,
    bottom: 0,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    flex: 1,
    display: 'flex',
  },
  textHeader: {
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
    fontStyle: 'normal',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: 0.48,
    color: Colors.black,
  },
  scrollView: {
    zIndex: 10,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 84 : 48,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  info: {
    fontSize: 16,
    color: '#777',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default FlightDetails;
