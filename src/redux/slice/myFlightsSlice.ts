import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../../models/flight';

interface MyFlightsState {
    flights: Flight[];
    loading: boolean;
}

const initialState: MyFlightsState = {
    flights: [],
    loading: false,
};

const myFlightsSlice = createSlice({
    name: 'myFlights',
    initialState,
    reducers: {
        setFlights(state, action: PayloadAction<Flight[]>) {
            state.flights = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { setFlights, setLoading } = myFlightsSlice.actions;

export const fetchMyFlights = () => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
        const jsonFlightData = await AsyncStorage.getItem('flightData');
        const flights = jsonFlightData ? JSON.parse(jsonFlightData) : [];
        dispatch(setFlights(flights));
    } catch (error) {
        console.error('Failed to retrieve flight data:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export default myFlightsSlice.reducer;
