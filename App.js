import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createStackNavigator, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  { useState, useEffect } from 'react';


import { f, auth, database, storage } from './config/config.js';


import feed from './app/screens/feed.js'
import profile from './app/screens/profile.js'
import upload from './app/screens/upload.js'
import userProfile from './app/screens/userProfile.js'
import comments from './app/screens/comments.js'

const Stack = createStackNavigator();
const MainStack= createBottomTabNavigator();
export default function App() {
  
  useEffect(() => {
    // Your code here
    login();
  }, []);

  login = async() => {
    // force login the user
    try{
      let user = await auth.signInWithEmailAndPassword('test@user.com','password');
    }catch(error){
      console.log(error)
    }
  }
  
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={
          //<NavigationContainer>
          <MainStack.Navigator>
            <MainStack.Screen name="Feed" component={feed} />
            <MainStack.Screen name="Upload" component={upload} />
            <MainStack.Screen name="Profile" component={profile} />
          </MainStack.Navigator>
          //</NavigationContainer>
      }/>
      
      <Stack.Screen name="User" component={userProfile} />
      <Stack.Screen name="Comments" component={comments} />
      
    </Stack.Navigator>
    </NavigationContainer>
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
/*
// in case of function App
<NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen name="Feed" component={feed} />
        <MainStack.Screen name="Upload" component={upload} />
        <MainStack.Screen name="Profile" component={profile} />
      </MainStack.Navigator>
    </NavigationContainer>
*/