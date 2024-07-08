import React, { useEffect } from "react";
import { Platform, PressableAndroidRippleConfig, StatusBar, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from "react-native";
import { NavigationState, Route, SceneMap, SceneRendererProps, TabBar, TabBarIndicatorProps, TabBarItemProps, TabView } from 'react-native-tab-view';
import { Event, Scene } from "react-native-tab-view/lib/typescript/src/types";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Arrivals from "./Arrivals";
import Departures from "./Departures";

export default function Flights({ navigation, route }: any) {
    const layout = useWindowDimensions();
    const { item } = route.params;

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Arrivals' },
        { key: 'second', title: 'Departures' },
    ]);

    const renderTabBar = (props: React.JSX.IntrinsicAttributes & SceneRendererProps & { navigationState: NavigationState<Route>; scrollEnabled?: boolean | undefined; bounces?: boolean | undefined; activeColor?: string | undefined; inactiveColor?: string | undefined; pressColor?: string | undefined; pressOpacity?: number | undefined; getLabelText?: ((scene: Scene<Route>) => string | undefined) | undefined; getAccessible?: ((scene: Scene<Route>) => boolean | undefined) | undefined; getAccessibilityLabel?: ((scene: Scene<Route>) => string | undefined) | undefined; getTestID?: ((scene: Scene<Route>) => string | undefined) | undefined; renderLabel?: ((scene: Scene<Route> & { focused: boolean; color: string; }) => React.ReactNode) | undefined; renderIcon?: ((scene: Scene<Route> & { focused: boolean; color: string; }) => React.ReactNode) | undefined; renderBadge?: ((scene: Scene<Route>) => React.ReactNode) | undefined; renderIndicator?: ((props: TabBarIndicatorProps<Route>) => React.ReactNode) | undefined; renderTabBarItem?: ((props: TabBarItemProps<Route> & { key: string; }) => React.ReactElement<any, string | React.JSXElementConstructor<any>>) | undefined; onTabPress?: ((scene: Scene<Route> & Event) => void) | undefined; onTabLongPress?: ((scene: Scene<Route>) => void) | undefined; tabStyle?: StyleProp<ViewStyle>; indicatorStyle?: StyleProp<ViewStyle>; indicatorContainerStyle?: StyleProp<ViewStyle>; labelStyle?: StyleProp<TextStyle>; contentContainerStyle?: StyleProp<ViewStyle>; style?: StyleProp<ViewStyle>; gap?: number | undefined; testID?: string | undefined; android_ripple?: PressableAndroidRippleConfig | undefined; }) => (
        <TabBar
            {...props}
            renderLabel={({ route, focused, color }: any) => (
                <Text style={styles.tabBarLabel}>
                    {route.title}
                </Text>
            )}
            indicatorStyle={{ backgroundColor: '#000022' }}
            style={styles.tabBar}
        />
    );

    const FirstRoute = () => (
        <Arrivals navigation={navigation} item={item} />
    );

    const SecondRoute = () => (
        <Departures navigation={navigation} item={item} />
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    useEffect(() => {
        console.log('flight')
        console.log(item)
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <StatusBar
                    animated={true}
                    backgroundColor="#F1EFEF"
                    barStyle={'dark-content'}
                />
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Text style={styles.textHeader}>BACK</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={styles.tabView}
                renderTabBar={renderTabBar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFDFD'
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
    textHeader: {
        fontWeight: 'bold',
        fontFamily: 'Roboto-Regular',
        fontStyle: 'normal',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: 0.48,
        color: Colors.black,
    },
    tabView: {
        backgroundColor: '#FDFDFD',
        //  marginTop: 20
    },
    scene: {
        flex: 1,
    },
    tabBar: {
        backgroundColor: '#FDFDFD',
        borderBottomColor: '#000022',
        borderBottomWidth: 1
    },
    tabBarLabel: {
        fontFamily: 'Abel-Regular',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 16,
        letterSpacing: 0.32,
        color: '#000022'
    },

});