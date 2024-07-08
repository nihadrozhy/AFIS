// App.js

import * as React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';
import Navigation from './src/routes/Routers';
import { clearDatabase, createAirportTable, createFlightTable } from './src/utils/database';
import offlineService from './src/utils/offlineService';

function App() {

  React.useEffect(() => {
    async function setup() {
      try {
        const isConnected = await offlineService.checkConnectivity();
        await createAirportTable(); // Create SQLite tables if they don't exist
        await createFlightTable();

        if (isConnected) {
          // Clear the database if the app is online
          await clearDatabase();
        }
        
      } catch (error) {
        console.error('Error in setup: ', error);
      }
    }

    setup();

  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
