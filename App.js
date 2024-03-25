import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import AddScreen from "./frontend/AddScreen.js";
import HomeScreen from "./frontend/Homepage.js";
import TrendScreen from "./frontend/TrendScreen.js";

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isRecordAdded, setIsRecordAdded] = useState(false);

  const setRecordAdded = () => {
    setIsRecordAdded(true);
  };

  const unsetRecordAdded = () => {
    setIsRecordAdded(false);
  };

  // console.log(Dimensions.get('window').width)
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home Screen"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        >
          {() => (
            <HomeScreen
              isRecordAdded={isRecordAdded}
              unsetRecordAdded={unsetRecordAdded}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Add Screen"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus" color={color} size={size} />
            ),
          }}
        >
          {() => <AddScreen setRecordAdded={setRecordAdded} />}
        </Tab.Screen>
        <Tab.Screen
          name="Trend Screen"
          component={TrendScreen}
          initialParams={{ name: "Bubu" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-line"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
