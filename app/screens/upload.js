
import React from 'react';
import {TextInput, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet,Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import UserAuth from '../components/auth.js'

class upload extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loggedin: false,
            imageId: this.uniqueId(),
            imageSelected: false,
            uploading: false,
            caption: '',
            progress: 0
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
            this.setState({
                imageSelected: true,
                imageId: this.uniqueId(),
                uri: result.uri
            })

            //this.uploadImage(result.uri);


        }else{
            console.log('cancel');
            this.setState({
                imageSelected: false
            })
        }
    }

    //this function checks if the caption exists and then publishes the image
    uploadPublish = () =>{
        if(this.state.uploading == false){
            if(this.state.caption != ''){
                this.uploadImage(this.state.uri)
            }else{ 
                alert('Please enter a caption..')
            }
        }else{
            console.log('Already uploading. Ignore button tap')
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
        this.setState({
            currentFileType: ext,
            uploading:true
        });

        
        //make image into a 'blob' to upload it.
        const response = await fetch(uri);
            //convert the response into a blob
        const blob = await response.blob();
        var FilePath = imageId+'.'+that.state.currentFileType;

        var uploadTask = storage.ref('user/'+userid+'/img').child(FilePath).put(blob); // this will be the location of image in firebase storage

        //.catch( function(error){
        //        console.log('error with upload - '+ error);
        //    });
        
        uploadTask.on('state_changed', snapshot => {
            var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            console.log('Upload is '+progress+'% complete');
            that.setState({
                progress:progress,
            });
        }, error => {
            console.log('error with upload - '+ error);
            reject(error);
        },() => {
            //upload complete, get the url of the uploaded image
            that.setState({progress: 100});
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                console.log(downloadURL);
                that.processUpload(downloadURL);
            })
        })
        /* //create a reference to the storage
        const ref = storage.ref('user/'+userid+'/img').child(FilePath); // this will be the location of image in firebase storage

        //call firebase storage to upload
        var snapshot = ref.put(blob).on('state_changed', snapshot => {
            console.log('Progress', snapshot.bytesTransferred, snapshot.totalBytes);
        });*/
    }
    
    processUpload = (imageUrl) => {
        //Process here. create the object and upload it to the firebase database.
        
        //Set the needed information
        var imageId = this.state.imageId;
        var userId = f.auth().currentUser.uid;
        var caption = this.state.caption;
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);
        
        //Building the photo object: author, caption, posted, url

        var photoObj = {
            author: userId,
            caption: caption,
            posted: timestamp,
            url: imageUrl
        };

        //Update the database
        //Add to the main feed
        database.ref('/photos/'+imageId).set(photoObj);
        
        //Set the user's photo object
        database.ref('/users/'+userId+'/photos/'+imageId).set(photoObj);

        alert('Image Uploaded!');

        this.setState({
            uploading: false,
            imageSelected: false,
            caption: '',
            uri: ''
        })
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
                    //check if an image is selected for the upload
                    <View style={{flex:1}}>
                        { this.state.imageSelected == true?(
                            <View style={{flex:1}}> 
                                <View style={{height:70 ,paddingTop:30, borderColor: '#d3d3d3', backgroundColor: 'white', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}> 
                                    <Text>Upload</Text>
                                </View>
                                <View style={{padding:5}}>
                                    <Text style = {{marginTop: 5}}>Caption</Text>
                                    <TextInput
                                        editable={true}
                                        placeholder={'Enter your caption...'}
                                        maxLength={150}
                                        multiline={true}
                                        numberOfLine={4}
                                        onChangeText={(text) => this.setState({caption: text})}
                                        style={{marginVertical:10, height:100, padding: 5, borderColor:'grey', borderWidth:1, borderRadius:3, backgroundColor:'white', color:'black'}}
                                    />

                                    <TouchableOpacity
                                    onPress={()=> this.uploadPublish()}
                                    style={{alignSelf:'center',width: 170, marginHorizontal:'auto',backgroundColor:'purple', borderRadius: 5, paddingVertical:10, paddingHorizontal:20}}>
                                        <Text style={{textAlign:'center',color:'white'}}>Upload & Publish</Text>
                                    </TouchableOpacity>

                                    {this.state.uploading == true ? (
                                        <View style={{marginTop:10}}>
                                        <Text>{this.state.progress}%</Text>
                                        {this.state.progress != 100 ? (
                                            <ActivityIndicator size="small" color="blue"/>
                                        ):(
                                            <Text>Processing</Text>
                                        )}
                                        </View>
                                    ):(
                                        <View></View>
                                    )}

                                    <Image source={{uri: this.state.uri}}
                                    style= {{marginTop: 10, resizeMode: 'cover', width:'100%', height: 275}}
                                    />
                                </View>
                            </View>
                        ):(
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:28, paddingBottom:15}}>Upload</Text>
                                <TouchableOpacity
                                style={{paddingVertical:10, paddingHorizontal:20, backgroundColor:'#bbbbba', borderRadius:5}}
                                onPress={() => this.findNewImage()}>
                                    <Text style={{color: 'white'}}>Select Photo</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        
                    </View>
                ):(
                    // not logged in
                    <UserAuth message={'Please login to upload a photo'}/>
                                        
                )}
               
            </View>
                
            
        );
    }
}

export default upload;