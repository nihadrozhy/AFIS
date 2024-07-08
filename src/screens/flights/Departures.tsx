import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { convertDate, FlightBox } from '../../components/FlightBox';
import { Flight } from '../../models';
import { Airport } from '../../models/airport';
import { fetchDepartureFlights, fetchDepartureFlightsOffline, fetchMoreDepartureFlights } from '../../redux/slice/departuresSlice';
import { AppDispatch, RootState } from '../../redux/store/store';
import offlineService from '../../utils/offlineService';

interface Props {
    navigation: any;
    item: Airport;
}

const Departures: React.FC<Props> = ({ navigation, item }) => {
    const dispatch: AppDispatch = useDispatch();
    const { width } = useWindowDimensions();
    // const [state, setState] = useState<Flight[]>(FlightDetails);

    const { flights, loading, error } = useSelector((state: RootState) => state.departures);
    const [page, setPage] = useState(1);

    useEffect(() => {
        console.log('item')

        console.log(item)
    }, []);

    useEffect(() => {
        async function fetchData() {
          const isConnected = await offlineService.checkConnectivity();
          if(item.iata !== undefined){
            if (isConnected) {
              dispatch(fetchDepartureFlights(item.iata));
            } else {
                dispatch(fetchDepartureFlightsOffline(item.iata));
            }
          }
        }
    
        fetchData();
      }, [dispatch]);

    const loadMore = () => {
        if (item.iata !== undefined) {
            dispatch(fetchMoreDepartureFlights(item.iata, page));
        }
        setPage(prevPage => prevPage + 1);
        console.log(page)
    };

    if (loading && flights.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error: {error}</Text>
            </View>
        );
    }
    const handleItem = (item: Flight) => {
        const itemNew = {
            from: item.from,
            to: item.to,
            flightNumber: item.flightNumber,
            airline: item.airline,
            departureTime: item.departureTime !== undefined ? convertDate(item.departureTime) : '',
            arrivalTime: item.arrivalTime !== undefined ? convertDate(item.arrivalTime) : '',
            status: item.status,
            latitude: item?.latitude,
            longitude: item?.longitude,
            iata: item.iata,
            flightStatus: item.flightStatus,
            aircraftTypeRegistration: item.aircraftTypeRegistration,
            aircraftTypeIata: item.aircraftTypeIata,
            aircraftTypeIcao: item.aircraftTypeIcao,
            aircraftTypeIcao24: item.aircraftTypeIcao24,
        }
        navigation.navigate('FlightDetails', { itemNew });
    }

    const renderItem = ({ item }: { item: Flight }) => (
        <TouchableOpacity onPress={() => { handleItem(item) }} >
            <FlightBox flight={item} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor="#F1EFEF"
                barStyle={'dark-content'}
            />

            <FlatList
                data={flights}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListFooterComponent={() => (
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        {loading && flights.length > 0 && <ActivityIndicator size="small" color="#0000ff" />}
                    </View>
                )}
                onEndReachedThreshold={0.1}
                // onEndReached={loadMore}
                contentContainerStyle={[styles.flatListContainer, { width }]}
            />
        </View>
    );
};
export default Departures;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    loading: {
        marginTop: 20,
    },
    flatListContainer: {
        display: 'flex',
        flexGrow: 1,
    },

});