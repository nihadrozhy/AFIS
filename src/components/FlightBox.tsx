import { StyleSheet, Text, View } from "react-native";
import { Flight } from "../models";

export interface FlightBoxProps {
    flight: Flight;
}
export const FlightBox: React.FC<FlightBoxProps> = ({
    flight,
}) => {
    return (
        <View style={[styles.box]}>
            <Text style={styles.text}>Airline: {flight.airline}</Text>
            <Text style={styles.text}>Flight number: {flight.flightNumber}</Text>
            <Text style={styles.text}>Departure time: {flight.departureTime !== undefined ? convertDate(flight.departureTime) : ''}</Text>
            <Text style={styles.text}>Arrival time: {flight.arrivalTime !== undefined ? convertDate(flight.arrivalTime) : ''}</Text>
            <Text style={styles.text}>Status: {flight.flightStatus}</Text>
        </View>
    )
}

export const convertDate = (date: string) => {
    const isoDateString = new Date(date);
    const utcTime = isoDateString?.getTime();
    // Define the offset for the desired timezone (e.g., UTC+5:30 for India Standard Time)
    const timezoneOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours offset in milliseconds
    const localTime = new Date(utcTime ?? 0 + timezoneOffset);
    const formattedDate = `${localTime.getFullYear()}-${("0" + (localTime.getMonth() + 1)).slice(-2)}-${("0" + localTime.getDate()).slice(-2)} ${("0" + localTime.getHours()).slice(-2)}:${("0" + localTime.getMinutes()).slice(-2)}:${("0" + localTime.getSeconds()).slice(-2)}`;
    return formattedDate.toString();
}

const styles = StyleSheet.create({
    box: {
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
    text: {
        fontSize: 16,
        marginBottom: 10,
    },

});
