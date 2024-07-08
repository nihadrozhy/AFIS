import React, { useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FlightBox } from '../../components/FlightBox';
import { fetchMyFlights } from '../../redux/slice/myFlightsSlice';
import { AppDispatch, RootState } from '../../redux/store/store';

export default function MyFlights({ navigation }: any) {
    const { width } = useWindowDimensions();
    const dispatch: AppDispatch = useDispatch();
    const flights = useSelector((state: RootState) => state.myFlights.flights);
    const loading = useSelector((state: RootState) => state.myFlights.loading);

    useEffect(() => {
        dispatch(fetchMyFlights());
    }, [dispatch]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => navigation.navigate('FlightDetails', { item })}>
            <FlightBox flight={item} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar animated={true} backgroundColor="#F1EFEF" barStyle={'dark-content'} />
            <Text style={styles.title}>My flights</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={flights}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.1}
                    contentContainerStyle={[styles.flatListContainer, { width }]}
                />
            )}
        </View>
    );
}

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
    flatListContainer: {
        display: 'flex',
        flexGrow: 1,
    },
});
