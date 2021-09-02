import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import feed from './app/screens/feed.js'
import profile from './app/screens/profile.js'
import upload from './app/screens/upload.js'
import userProfile from './app/screens/userProfile.js'
import comments from './app/screens/comments.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const BottomStack= createBottomTabNavigator();

function BottomTab(){
  return (
    
      <BottomStack.Navigator
      tabBarOptions={{
        activeTintColor: '#e91e63'
      }}>
        <BottomStack.Screen 
        name="Feed" 
        component={feed} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
          }} 
        />

        <BottomStack.Screen 
        name="Upload" 
        component={upload}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera-plus-outline" color={color} size={size} />
          ),
          }} 
        />

        <BottomStack.Screen 
        name="Profile" 
        component={profile} 
          options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" color={color} size={size} />
          ),
          }}
        />
      </BottomStack.Navigator>
    
  );
}
function MainStack() {
  return (
    <NavigationContainer>
    <Stack.Navigator
    initialRouteName="Home"
    mode="modal"
    headerMode='none'> 
      <Stack.Screen name="Home" component={BottomTab} />
      <Stack.Screen name="User" component={userProfile} />
      <Stack.Screen name="Comments" component={comments} />
      
    </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  
  useEffect(() => {
    // Your code here
    
  }, []);

  
  return (
    <MainStack/>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});