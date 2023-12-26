import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './frontend/Homepage.js';
import TrendScreen from './frontend/TrendScreen.js';
import AddScreen from './frontend/AddScreen.js';

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const DetailsScreen = ({ navigation, route }) => {
  return <Text>This is {route.params.name}'s Details</Text>;
};


export default function App() {
  // console.log(Dimensions.get('window').width)
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Details"
          component={DetailsScreen}
          initialParams={{ name: "Bubu" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="eye" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Add Screen"
          component={AddScreen}
          initialParams={{ name: "Bubu" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Trend Screen"
          component={TrendScreen}
          initialParams={{ name: "Bubu" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
