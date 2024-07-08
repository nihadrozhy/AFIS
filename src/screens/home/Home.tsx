import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Airport } from '../../models';
import { fetchAirports, fetchAirportsBySearch, fetchAirportsOffline, fetchMoreAirports, searchAirportsOffline } from '../../redux/slice/airportsSlice';
import { AppDispatch, RootState } from '../../redux/store/store';
import offlineService from '../../utils/offlineService';

export default function Home({ navigation }: any) {

    const { width } = useWindowDimensions();
    const dispatch: AppDispatch = useDispatch();

    const { airports, loading, error } = useSelector((state: RootState) => state.airports);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        async function fetchData() {
          const isConnected = await offlineService.checkConnectivity();
          if (isConnected) {
            dispatch(fetchAirports());
          } else {
            dispatch(fetchAirportsOffline());
          }
        }
    
        fetchData();
      }, [dispatch]);
    
      const handleSearch = async () => {
        const isConnected = await offlineService.checkConnectivity();
        if (query.trim() !== '') {
          if (isConnected) {
            dispatch(fetchAirportsBySearch(query));
          } else {
            dispatch(searchAirportsOffline(query));
          }
          setPage(0);
        } else {
          if (isConnected) {
            dispatch(fetchAirports());
          } else {
            dispatch(fetchAirportsOffline());
          }
          setPage(0);
        }
      };
    
      const loadMore = async () => {
        const isConnected = await offlineService.checkConnectivity();
        if (isConnected) {
          dispatch(fetchMoreAirports(query, page));
          setPage(prevPage => prevPage + 1);
        } else {
          // Optionally, you can handle offline load more here if you store paginated results locally
          console.log('Offline mode: cannot load more data.');
        }
      };

    if (loading && airports.length === 0) {
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

    const renderItem = ({ item }: { item: Airport }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Flight', { item })} style={[styles.item]}>
            <Text>{item.name}</Text>
            <Text>{item.iata}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor="#F1EFEF"
                barStyle={'dark-content'}
            />
            <Text style={styles.title}>Airports</Text>

            <TextInput
                style={styles.input}
                placeholder="Search by name or ICAO"
                value={query}
                onChangeText={text => setQuery(text)}
            />

            <TouchableOpacity onPress={handleSearch} style={styles.button}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            <FlatList
                data={airports}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListFooterComponent={() => (
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        {loading && airports.length > 0 && <ActivityIndicator size="small" color="#0000ff" />}
                    </View>
                )}
                onEndReachedThreshold={0.1}
                onEndReached={loadMore}
                contentContainerStyle={[styles.flatListContainer, { width }]}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        height: 50,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 15
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    item: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    loading: {
        marginTop: 20,
    },
    flatListContainer: {
        display: 'flex',
        flexGrow: 1,
    },
});