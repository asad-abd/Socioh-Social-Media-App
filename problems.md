## ReactStackNavigator old version problem 
I had to make the main App component a function instead of a class component to apply bottomStackNavigator() 
Its code was very different than what was in the tutorial, so I pasted the code from the docs.

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