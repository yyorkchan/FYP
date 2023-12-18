import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// import {
//   LineChart,
// } from 'react-native-chart-kit'

// const line = {
//   legend: ['Prediction Trend', "Record",],
//   labels: ['Jan', 'February', 'March', 'April', 'May', 'June'],
//   datasets: [
//     {
//       data: [200, 450, 280, 800, 690, 530],
//       strokeWidth: 2, // optional
//       color: (opacity = 1) => `rgba(255, 255, 128, ${opacity})`,
//       // labelColor: (opacity = 1) => `rgba(128, 255, 255, ${opacity})`,
//     },
//     {
//       data: [200, 450, 280, 800, 690],
//       strokeWidth: 2, // optional
//       color: (opacity = 1) => `rgba(128, 255, 128, ${opacity})`,
//     },
//   ],
// };
const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <Button
      title="Go to Details Page"
      onPress={() =>
        navigation.navigate('Details', { name: 'BubuJai' })
      }
    />
  );
};
const DetailsScreen = ({ navigation, route }) => {
  return <Text>This is {route.params.name}'s Details</Text>;
};

export default function App() {
  // console.log(Dimensions.get('window').width)
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? 25 : 0,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});