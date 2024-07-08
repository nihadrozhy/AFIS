// src/utils/database.ts

import SQLite from 'react-native-sqlite-storage';
import { Airport, Flight } from '../models';
import { convertDate } from '../components/FlightBox';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'AirportsFlights.db';
const database_version = '1.0';
const database_displayname = 'SQLite Airports and Flights Database';
const database_size = 200000;

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabase({
      name: database_name,
      location: 'default',
      createFromLocation: '~www/AirportsFlights.db',
    });
  }
  return db;
};

export const createAirportTable = async () => {
  const db = await initDatabase();
  try {
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS Airport (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        country TEXT,
        icao TEXT,
        iata TEXT UNIQUE
      );`
    );
  } catch (error) {
    console.error('Error creating Airport table: ', error);
  }
};

export const createFlightTable = async () => {
  const db = await initDatabase();
  try {
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS Flight (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromLocation TEXT,
        toLocation TEXT,
        flightNumber TEXT UNIQUE,  -- Ensure flightNumber is UNIQUE
        airline TEXT,
        departureTime TEXT,
        arrivalTime TEXT,
        status TEXT,
        latitude REAL,
        longitude REAL,
        iata TEXT,
        flightStatus TEXT,
        aircraftTypeRegistration TEXT,
        aircraftTypeIata TEXT,
        aircraftTypeIcao TEXT,
        aircraftTypeIcao24 TEXT,
        FOREIGN KEY (iata) REFERENCES Airport(iata)
      );`
    );
  } catch (error) {
    console.error('Error creating Flight table: ', error);
  }
};

export const insertAirport = async (airport) => {
  const db = await initDatabase();
  try {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `INSERT INTO Airport (name, country, icao, iata) 
         VALUES (?, ?, ?, ?)
         ON CONFLICT(iata) DO UPDATE SET 
           name = excluded.name,
           country = excluded.country,
           icao = excluded.icao`,
        [airport.name, airport.country, airport.icao, airport.iata]
      );
    });
  } catch (error) {
    console.error('Error inserting airport: ', error);
  }
};

export const insertFlight = async (flight) => {
  const db = await initDatabase();
  try {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `INSERT INTO Flight (fromLocation, toLocation, flightNumber, airline, departureTime, arrivalTime, status, latitude, longitude, iata, flightStatus, aircraftTypeRegistration, aircraftTypeIata, aircraftTypeIcao, aircraftTypeIcao24) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(flightNumber) DO UPDATE SET
           fromLocation = excluded.fromLocation,
           toLocation = excluded.toLocation,
           airline = excluded.airline,
           departureTime = excluded.departureTime,
           arrivalTime = excluded.arrivalTime,
           status = excluded.status,
           latitude = excluded.latitude,
           longitude = excluded.longitude,
           iata = excluded.iata,
           flightStatus = excluded.flightStatus,
           aircraftTypeRegistration = excluded.aircraftTypeRegistration,
           aircraftTypeIata = excluded.aircraftTypeIata,
           aircraftTypeIcao = excluded.aircraftTypeIcao,
           aircraftTypeIcao24 = excluded.aircraftTypeIcao24;`,
        [
          flight.fromLocation ?? '',
          flight.toLocation ?? '',
          flight.flightNumber ?? '',
          flight.airline ?? '',
          flight.departureTime !== undefined ? convertDate(flight.departureTime) : '',
          flight.arrivalTime !== undefined ? convertDate(flight.arrivalTime) : '',
          flight.status ?? '',
          flight.latitude ?? 0,
          flight.longitude ?? 0,
          flight.iata ?? '',
          flight.flightStatus ?? '',
          flight.aircraftTypeRegistration ?? '',
          flight.aircraftTypeIata ?? '',
          flight.aircraftTypeIcao ?? '',
          flight.aircraftTypeIcao24 ?? '',
        ]
      );
    });
  } catch (error) {
    console.error('Error inserting flight: ', error);
  }
};


export const getAirports = async () => {
  const db = await initDatabase();
  try {
    const results = await db.executeSql('SELECT * FROM Airport');
    const rows = results[0].rows;
    let airports = [];
    for (let i = 0; i < rows.length; i++) {
      airports.push(rows.item(i));
    }
    return airports;
  } catch (error) {
    console.error('Error fetching airports: ', error);
    return [];
  }
};

export const getFlights = async () => {
  const db = await initDatabase();
  try {
    const results = await db.executeSql('SELECT * FROM Flight');
    const rows = results[0].rows;
    let flights = [];
    for (let i = 0; i < rows.length; i++) {
      flights.push(rows.item(i));
    }
    return flights;
  } catch (error) {
    console.error('Error fetching flights: ', error);
    return [];
  }
};

export const getDepartureFlightsByIata = async (iata: string) => {
  const db = await initDatabase();
  try {
    const results = await db.executeSql('SELECT * FROM Flight WHERE iata = ? AND status = ?', [iata, 'departure']);
    const rows = results[0].rows;
    let flights: Flight[] = [];
    for (let i = 0; i < rows.length; i++) {
      flights.push(rows.item(i));
    }
    return flights;
  } catch (error) {
    console.error('Error fetching departure flights: ', error);
    return [];
  }
};

export const getArrivalFlightsByIata = async (iata: string) => {
  const db = await initDatabase();
  try {
    const results = await db.executeSql('SELECT * FROM Flight WHERE iata = ? AND status = ?', [iata, 'arrival']);
    const rows = results[0].rows;
    let flights: Flight[] = [];
    for (let i = 0; i < rows.length; i++) {
      flights.push(rows.item(i));
    }
    return flights;
  } catch (error) {
    console.error('Error fetching arrival flights: ', error);
    return [];
  }
};

export const searchAirports = (query: string): Promise<Airport[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM airports WHERE name LIKE ? OR country LIKE ? OR iata LIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

export const clearDatabase = async () => {
  const db = await initDatabase();
  try {
    await db.transaction(async (tx) => {
      await tx.executeSql('DELETE FROM Airport');
      await tx.executeSql('DELETE FROM Flight');
    });
  } catch (error) {
    console.error('Error clearing database: ', error);
  }
};
