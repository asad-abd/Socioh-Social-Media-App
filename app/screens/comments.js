
import React from 'react';
import {FlatList, StyleSheet,Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

class upload extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loggedin: false
        }
    }

    componentDidMount = () =>{
        var that=this; //need a reference for firebase because this cannot be used it that
        // check if the user is logged in or not
        f.auth().onAuthStateChanged(function(user){
            if(user){// if user exists
                //logged in
                that.setState({
                    loggedin: true
                });
            }else{
                that.setState({
                    loggedin: false
                });
            }
        })
    }

    render(){
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}> 
                {this.state.loggedin == true ? (
                    <Text>Comments</Text>
                ):(
                   <View> 
                        <Text>You are not logged in</Text>
                        <Text>Please login to post a coment</Text>
                    </View>
                )}
               
            </View>
                
            
        );
    }
}

export default upload;