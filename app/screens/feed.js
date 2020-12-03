import React from 'react';
import {Button, TouchableOpacity, FlatList, StyleSheet,Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

import PhotoList from '../components/photoList.js'

class feed extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true
        }
    }

    /*componentDidMount = () =>{


    }*/

    
    render(){
        return (
            <View style={{flex:1}}>
                <View style={{height:70 ,paddingTop:30, borderColor: '#d3d3d3', backgroundColor: 'white', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}> 
                    <Text>Feed</Text>
                </View>

                <PhotoList isUser={false}  navigation={this.props.navigation}/>
                    
                
            </View>
        );
    }
}

export default feed;