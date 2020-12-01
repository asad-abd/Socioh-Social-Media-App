
import React from 'react';
import {TouchableOpacity, FlatList, StyleSheet,Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

class upload extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loggedin: false,
            imageId: this.uniqueId()
        }
        //alert(this.uniqueId());
    }

    //will be async because we need to wait for the results
    _checkPermissions = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({camera:status});

        const {statusRoll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({camera:statusRoll});
    }

    //function to create a random sequence
    s4 = () => {
        return  Math.floor((1+ Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    uniqueId = () => {
        return (this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
        this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4());
    }

    findNewImage = async() =>{
        this._checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result);

        if(!result.cancelled){

            console.log('upload image');
            this.uploadImage(result.uri);


        }else{
            console.log('cancel');
        }
    }

    uploadImage = async(uri) =>{
        //
        var that = this;
        var userid = f.auth().currentUser.uid;
        var imageId = this.state.imageId

        //check for the kind of extension
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];
        this.setState({currentFileType: ext});

        //make image into a 'blob' to upload it.
        const response = await fetch(uri);
            //convert the response into a blob
        const blob = await response.blob();
        var FilePath = imageId+'.'+that.state.currentFileType;

        //create a reference to the storage
        const ref = storage.ref('user/'+userid+'/img').child(FilePath); // this will be the location of image in firebase storage

        //call firebase storage to upload
        var snapshot = ref.put(blob).on('state_changed', snapshot => {
            console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
        });
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
            <View style={{flex:1}}> 
                {this.state.loggedin == true ? (
                    // are logged in
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:28, paddingBottom:15}}>Upload</Text>
                        <TouchableOpacity
                        style={{paddingVertical:10, paddingHorizontal:20, backgroundColor:'#bbbbba', borderRadius:5}}
                        onPress={() => this.findNewImage()}>
                            <Text style={{color: 'white'}}>Select Photo</Text>
                        </TouchableOpacity>
                    </View>
                ):(
                    // not logged in
                   <View style={{flex:1}}> 
                        <Text>You are not logged in</Text>
                        <Text>Please login to upload a photo</Text>
                    </View>
                )}
               
            </View>
                
            
        );
    }
}

export default upload;