import React from 'react';
import {TouchableOpacity, FlatList, StyleSheet,Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

import PhotoList from '../components/photoList.js'

class userProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loaded: false
        }
    }

    checkParams= () =>{
        //checks the sent thru feed.js
        var params = this.props.route.params;
        //const datas = getNavigationParams
        if(params.userId){//if the userID exists
            this.setState({
                userId: params.userId
            });
            this.fetchUserInfo(params.userId);
        }
    }

    fetchUserInfo= (userId) =>{
        //fetch the info of the user requested from feed.js after checking is done.
        var that= this;

        database.ref('users').child(userId).child('username').once('value').then(function(snapshot) {
            // first check if the data exists 
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
                that.setState({username:data});
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('name').once('value').then(function(snapshot) {
            // first check if the data exists 
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
                that.setState({name:data});
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('avatar').once('value').then(function(snapshot) {
            // first check if the data exists 
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
                that.setState({avatar:data,
                loaded:true});
        }).catch(error => console.log(error));

    }

    componentDidMount = () =>{
        this.checkParams();
    }
// <View style={{flex:1, height:70 ,paddingTop:30, borderColor: '#d3d3d3', backgroundColor: 'white', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}> 
    render(){
        return (
            <View style={{flex:1}}> 
                { this.state.loaded == false ? (
                    <View>
                        <Text>Loading...</Text>
                    </View>
                ):(
                    <View style={{flex:1}}>
                        <View style={{flexDirection:'row',height:70 ,paddingTop:30, borderColor: '#d3d3d3', backgroundColor: 'white', borderBottomWidth: 0.5, justifyContent: 'space-between', alignItems: 'center'}}>
                            <TouchableOpacity style={{width:100}} onPress={()=> this.props.navigation.goBack()}>
                                <Text style={{fontSize:12, fontWeight:'bold', paddingLeft: 10}}>Go Back</Text>
                            </TouchableOpacity>
                            <Text>Profile</Text>
                            <Text style={{width:100}}> </Text>

                        </View>
                        <View style={{justifyContent:'space-evenly', alignItems:'center', flexDirection: 'row', paddingVertical: 10}}>
                            <Image source={{ uri: this.state.avatar }} style={{marginLeft: 10, width:100, height:100, borderRadius: 50}}/>
                            <View style={{marginRight:10}}> 
                                <Text>{this.state.name}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>

                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}/>
                    
                    </View>
                )}
               
            </View>
                
        )
    }
}

export default userProfile;