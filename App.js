import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { f, auth, database, storage } from './config/config.js';


import feed from './app/screens/feed.js'
import profile from './app/screens/profile.js'
import upload from './app/screens/upload.js'
import userProfile from './app/screens/userProfile.js'
import comments from './app/screens/comments.js'

const Stack = createStackNavigator();
const BottomStack= createBottomTabNavigator();

function BottomTab(){
  return (
    
      <BottomStack.Navigator>
        <BottomStack.Screen name="Feed" component={feed} />
        <BottomStack.Screen name="Upload" component={upload} />
        <BottomStack.Screen name="Profile" component={profile} />
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
//registerRootComponent(App);
/*
// in case of function App
<NavigationContainer>
      <BottomStack.Navigator>
        <BottomStack.Screen name="Feed" component={feed} />
        <BottomStack.Screen name="Upload" component={upload} />
        <BottomStack.Screen name="Profile" component={profile} />
      </BottomStack.Navigator>
    </NavigationContainer>
*/