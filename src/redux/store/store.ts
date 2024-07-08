// store/index.ts

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import airportsReducer from '../slice/airportsSlice';
import flightsReducer from '../slice/flightsSlice';
import flightDetailsReducer from '../slice/flightDetailsSlice';
import myFlightsReducer from '../slice/myFlightsSlice';
import arrivalsReducer from '../slice/arrivalsSlice';
import departuresReducer from '../slice/departuresSlice';


const store = configureStore({
  reducer: {
    airports: airportsReducer,
    flights: flightsReducer,
    flightDetails: flightDetailsReducer,
    myFlights: myFlightsReducer,
    arrivals: arrivalsReducer,
    departures: departuresReducer,

  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;
