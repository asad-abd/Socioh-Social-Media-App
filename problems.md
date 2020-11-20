## ReactStackNavigator old version problem 
I had to make the main App component a function instead of a class component to apply bottomStackNavigator() 
Its code was very different than what was in the tutorial, so I pasted the code from the docs.

## problem with App.js:
I had to use functional component while the tutorial used a class component.
React bottomStackNavigator() was avaliable only in functions not classes. 
while testing, 'login()' function was created and I had to use **react hooks' useEffect()** as an equivalent to calling it in the constructor.

## Important notes/observations/ silly mistakes corrections
1. firebase.signInWithEmailAndPassword() doesn't create new users! it just signs them in. So first create a sample user in firebase then use it
 
2. 