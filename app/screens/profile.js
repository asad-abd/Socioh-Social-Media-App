import React from 'react';
import {TextInput, TouchableOpacity, FlatList, StyleSheet,Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

import PhotoList from '../components/photoList.js'
import UserAuth from '../components/auth.js'

class profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loggedin: true,
            
        }
    }

    fetchUserInfo = (userId) => {

        var that=this;
        database.ref('users').child(userId).once('value').then(function(snapshot){
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({
                username: data.username,
                name: data.name,
                avatar: data.avatar,
                loggedin: true,
                userId: userId
            })
        }) 
    }

    componentDidMount = () =>{
        var that=this; //need a reference for firebase because this cannot be used it that
        // check if the user is logged in or not
        f.auth().onAuthStateChanged(function(user){
            if(user){// if user exists
                //logged in
                that.fetchUserInfo(user.uid);
            }else{
                that.setState({
                    loggedin: false
                });
            }
        })
    }

    saveProfile = () => {

        var name = this.state.name;
        var username = this.state.username;

        if(name !== ''){
            database.ref('users').child(this.state.userId).child('name').set(name);
        }
        if(username !== ''){
            database.ref('users').child(this.state.userId).child('username').set(username);
        }
        this.setState({editingProfile: false});
    }
    
    logoutUser = () => {
        f.auth().signOut();
        alert('Logged out')
    }

    editProfile = () => {
        this.setState({editingProfile: true})
    }

    render(){
        return (
            <View style={{flex:1}}> 
                {this.state.loggedin == true ? (
                    // are logged in
                    <View style={{flex:1}}>
                        <View style={{height:70 ,paddingTop:30, borderColor: '#d3d3d3', backgroundColor: 'white', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
                            <Text>Profile</Text>
                        </View>
                        <View style={{justifyContent:'space-evenly', alignItems:'center', flexDirection: 'row', paddingVertical: 10}}>
                            <Image source={{ uri: this.state.avatar}} style={{marginLeft: 10, width:100, height:100, borderRadius: 50}}/>
                            <View style={{marginRight:10}}> 
                                <Text>{this.state.name}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>
                        {this.state.editingProfile == true ? (
                            <View style={{alignItems:'center', justifyContent:'center', paddingBottom: 20, borderBottomWidth: 1}}>
                                <TouchableOpacity onPress={ () => this.setState({editingProfile: false})}>
                                    <Text style={{fontWeight: 'bold'}}>Cancel Editing</Text>
                                </TouchableOpacity>
                                <Text>Name: </Text>
                                <TextInput
                                    editable={true}
                                    placeholder={'Enter your name'}
                                    onChangeText={(text)=> this.setState({name: text})}
                                    value={this.state.name}
                                    style={{width:250, marginVertical: 10, padding: 5, borderColor: 'grey', borderWidth:1}}
                                />

                                <Text>Usersname: </Text>
                                <TextInput
                                    editable={true}
                                    placeholder={'Enter your username'}
                                    onChangeText={(text)=> this.setState({username: text})}
                                    value={this.state.username}
                                    style={{width:250, marginVertical: 10, padding: 5, borderColor: 'grey', borderWidth:1}}
                                />
                                <TouchableOpacity style={{backgroundColor:'black', padding:8.5}}
                                    onPress={ () => this.saveProfile()}>
                                    <Text style={{color:'white', fontWeight: 'bold'}}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        ):(

                            <View style={{paddingBottom: 20, borderBottomWidth: 1}}>
                                <TouchableOpacity 
                                onPress={() => this.logoutUser()}
                                style={{marginTop:10, marginHorizontal:40, paddingVertical: 15, borderRadius:20, borderColor: 'grey', borderWidth:1.5}}>
                                    <Text style={{textAlign:'center', color:'grey'}}>Logout</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress={() => this.editProfile()}
                                style={{marginTop:10, marginHorizontal:40, paddingVertical: 15, borderRadius:20, borderColor: 'grey', borderWidth:1.5}}>
                                    <Text style={{textAlign:'center', color:'grey'}}>Edit Profile</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                onPress={() => this.props.navigation.navigate('Upload')}
                                style={{backgroundColor:'grey', marginTop:10, marginHorizontal:40, paddingVertical: 25, borderRadius:25, borderColor: 'grey', borderWidth:1.5}}>
                                    <Text style={{textAlign:'center', color:'white'}}>Upload New+</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}/>
                    </View>
                ):(
                    //not logged in
                   <UserAuth message={'Please login to view your profile'}/>
                )}
               
            </View>
                
            
        );
    }
}

export default profile;