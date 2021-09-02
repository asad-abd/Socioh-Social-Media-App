
import React from 'react';
import {TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList, StyleSheet,Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

import UserAuth from '../components/auth.js'

class comment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loggedin: false,
            comments_list: [] 
            
        }
    }

    checkParams= () =>{
        //checks the sent thru feed.js
        var params = this.props.route.params;
        //const datas = getNavigationParams
        if(params.photoId){//if the userID exists
            this.setState({
                photoId: params.photoId
                
            });
            //console.log("params in checkparams: ",params.photoId)
            this.fetchComments(params.photoId);
        }
    }

    addCommentToList = (comments_list, data, comment) => {
        //console.log("added ",comments_list,data, comment);
        var that= this;
        var commentObj = data[comment];
        database.ref('users').child(commentObj.author).child('username').once('value').then(function(snapshot){

            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();

            comments_list.push({
                id: comment.toString(),
                comment: commentObj.comment.toString(),
                posted: that.timeConverter(commentObj.posted).toString(),
                author: data.toString(),
                authorId: commentObj.author.toString() 
            })

            that.setState({
                refresh: false,
                loading: false
            })
        }).catch(error => console.log(error))
    }

    fetchComments = (photoId) => {
        var that = this;
        
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then( function(snapshot){
            //console.log("snapshot  ",snapshot);
        
            const exists = (snapshot.val() !== null);
            if(exists){
                //add comments to flatlist
                data = snapshot.val();
                var comments_list = that.state.comments_list;

                for( var comment in data){
                    that.addCommentToList(comments_list,data, comment)
                }
            }else{
                that.setState({
                    comments_list: []
                })
            }
        }).catch(error => console.log(error));
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

    pluralCheck = (s) =>{

        if(s==1){
            return ' ago';
        }else{
            return 's ago';
        }
    }

    timeConverter = (timestamp) => {

        var time = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - time)/1000);

        var interval = Math.floor(seconds/ 31536000);
        if(interval > 1){
            return interval + ' year'+this.pluralCheck(interval);
        }
        interval = Math.floor(seconds/ 2592000);
        if(interval > 1){
            return interval + ' month'+this.pluralCheck(interval);
        }
        interval = Math.floor(seconds/ 86400);
        if(interval > 1){
            return interval + ' day'+this.pluralCheck(interval);
        }
        interval = Math.floor(seconds/ 3600);
        if(interval > 1){
            return interval + ' hour'+this.pluralCheck(interval);
        }
        interval = Math.floor(seconds/ 60);
        if(interval > 1){
            return interval + ' minute'+this.pluralCheck(interval);
        }
        return Math.floor(seconds) + ' second'+this.pluralCheck(seconds);
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

        this.checkParams();
    }

    postComment = () =>{
        
        var comment = this.state.comment;
        if(comment != ''){
            //process
            var imageId = this.state.photoId;
            //console.log("Ph ID : "+imageId);
            var userId = f.auth().currentUser.uid;
            var commentId = this.uniqueId();
            //console.log("comment ID : "+commentId);
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime / 1000);

            this.setState({
                comment: ''
            });
            //comment=String(comment);
            //console.log("comment text : "+comment);
            var commentObj = {
                posted: timestamp,
                author: userId,
                comment: comment
            };

            database.ref('/comments/'+imageId+'/'+commentId).set(commentObj)
            
            //reload the comment
            this.reloadCommentList();
        }else{
            alert('Please enter a comment before posting.');
        }
    }

    reloadCommentList = () => {
        this.setState({
            comments_list: []
        })
        this.fetchComments(this.state.photoId);
    }

    render(){
        return (
            <View style={{flex:1}}> 
                <View style={{flexDirection:'row',height:70 ,paddingTop:30, borderColor: '#d3d3d3', backgroundColor: 'white', borderBottomWidth: 0.5, justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity style={{width:100}} onPress={()=> this.props.navigation.goBack()}>
                        <Text style={{fontSize:12, fontWeight:'bold', paddingLeft: 10}}>Go Back</Text>
                    </TouchableOpacity>
                    <Text>Comments</Text>
                    <Text style={{width:100}}> </Text>
                </View>

                { this.state.comments_list.length == 0 ? (
                    // no comments, show empty state
                    <Text>No Comments found</Text>
                ) : (
                    // there are comments
                    <FlatList 
                    refreshing= {this.state.refresh}
                    data= {this.state.comments_list}
                    keyExtractor={(item,index)=> index.toString()}
                    style={{flex:1, backgroundColor:'#eee'}}
                    renderItem={({item, index})=> (
                        <View key={index} style={{width: '100%', overflow:'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor:'grey'}}>
                            <View style={{padding:5, width: '100%', flexDirection:'row', justifyContent:'space-between'}}>
                                <Text>{item.posted}</Text>
                                <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('User',{userId: item.authorId})}>
                                    <Text>{item.author}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{padding:5}}>
                                <Text>{item.comment}</Text>
                            </View>
                        </View>
                    )}
                    />
                )}

                {this.state.loggedin == true ? (
                    <KeyboardAvoidingView behavior="padding" enabled style={{borderTopWidth: 1, borderTopColor: 'grey', padding:10, marginBottom: 15}}>
                        <Text style={{fontWeight: 'bold'}}>Post Comment</Text>
                        <View>
                            <TextInput
                                editable={true}
                                placeholder={'enter your comment here..'}
                                onChangeText={(text) => this.setState({comment: text})}
                                value={this.state.comment}
                                style={{marginVertical:10, height:50, padding:5, borderColor: 'grey', borderRadius: 3, backgroundColor:'white', color:'black'}}
                            />
                            <TouchableOpacity
                            style={{paddingVertical:10, paddingHorizontal:20, backgroundColor: 'blue', borderRadius: 5}}
                            onPress={ () => this.postComment()}>
                                <Text style={{color:'white'}}>Post</Text>
                            </TouchableOpacity>
                            
                        </View>
                    </KeyboardAvoidingView>
                ):(
                    <UserAuth message={'Please login to post a comment'} moveScreen={true} navigation={this.props.navigation}/>
                   
                )}
               
            </View>
                
            
        );
    }
}

export default comment;