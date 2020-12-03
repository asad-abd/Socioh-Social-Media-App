## ReactStackNavigator old version problem 
I had to make the main App component a function instead of a class component to apply bottomStackNavigator() 

Its code was very different than what was in the tutorial, so I pasted the working version of the code from the docs.

## problem with App.js:
I had to use functional component while the tutorial used a class component.
React bottomStackNavigator() was avaliable only in functions not classes. 
while testing, 'login()' function was created and I had to use **react hooks' useEffect()** as an equivalent to calling it in the constructor.

## Important notes/observations/ silly mistakes corrections
1. firebase.signInWithEmailAndPassword() doesn't create new users! it just signs them in. So first create a sample user in firebase then use it
 
2. Viewing the UserProfile of other users in the Feed
<TouchableOpacity  onPress={() => this.props.navigation navigate('User',{userId: item.authorId})}> 
This allows the currently logged-in user to see the userProfile of some other user by extracting out the authorId from the photo object of the photo that we  are currently seeing on the feed page.

3. Navigation between pages while passing parameters (took a lot of time to fix)
    (in userProfile.js)
"this.props.navigation.state.params" -> doesn't work for 5.x

instead use: "this.props.route.params"

    (This one took a lot of time to identify the actual problem.)

4. Observation/Note: in fetchUserInfo() in "userProfile.js", we cannot directly fetch the whole user object and have to make 3 separate calls for it.

This is because of the way we have written our security rules. only the actual user can fetch the whole user object.

5. Storing in the Firebase storage
    This will be the location of image in firebase storage:- const ref = storage.ref('user/'+userid+'/img').child(FilePath); 
    
    Read the file: upload.js for more details

6.  ```[Unhandled promise rejection: TypeError: Network request failed]``` due to a typo in upload.js

Forgot to enter "this.state.uri" in "this.uploadImage(this.state.uri)" in the "uploadPublish()" function. Error solved after that.

7. ```Error: Objects are not valid as a React child (found: object with keys {5d25b692-fee6-54be-64d8-c643-a031-16e2, photo-example-id}). If you meant to render a collection of children, use an array instead. ```
Solved by adding toString() at the end of the objects pushed into photo_feed[] in the function 'addToFlatList' in 'feed.js'

8. ``` Reference.set failed: First argument contains undefined in property 'comments.5d25b692-fee6-54be-64d8-c643-a031-16e2.92224596-32ad-9b9a-1ad0-c2f9-62f8-8b76.comment' ```

Again a typo, in the file upload.js. I was setting the state of 'comments' and trying to access 'comment'! 