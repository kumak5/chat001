import React, {useState, useEffect, useCallback} from 'react'
import MassageBody from "./MessageBody";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


// let email = "test@test.ru"
// let password = "test123"

var firebaseConfig = {
    apiKey: "AIzaSyDalHXewdt2J07RLqLYkY5u4ldMBRCf_JE",
    authDomain: "chat001-dbcd3.firebaseapp.com",
    databaseURL: "https://chat001-dbcd3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat001-dbcd3",
    storageBucket: "chat001-dbcd3.appspot.com",
    messagingSenderId: "521055209249",
    appId: "1:521055209249:web:15d0fb5576d3d7fb092060"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const chat = firebase.database().ref('test/chat');


function sendMessage(msg, user) {
    console.log()
    let date = new Date().getTime()
    let id = Date.now() + Math.random()
    chat.push({ id: id, message: msg, date: date, nickname: user})
}

function ChatMessages() {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        chat.on('child_added', snapshot => {
            const newMessage = snapshot.val();
            // Only add if is not already in the state since a re-render will
            // make child_added return the last val again
            if (!messages.some(message => message.id == newMessage.id)) {
                setMessages([...messages, newMessage]);
                console.log(newMessage)
            }
        });
        return function cleanup() {chat.off('child_added')}
    })
    return messages
}

const useFirebase = () => {
    const [authUser, setAuthUser] = useState(firebase.auth().currentUser);

    useEffect(() => {
        const unsubscribe = firebase.auth()
            .onAuthStateChanged((user) => setAuthUser(user))
        return () => {
            unsubscribe()
        };
    }, []);

    const login = useCallback((email, password) => firebase.auth()
        .signInWithEmailAndPassword(email, password), []);

    const logout = useCallback(() => firebase.auth().signOut(), [])

    const registerUser = useCallback((email, password) => firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            let user = userCredentials.user; //access the newly created user
            console.log('User created: '+user.uid);
        })
        .catch((error) => { //report any errors
            console.log(error.message);
        }) ,[])

    return { login, authUser, logout, registerUser }
}



const ChatPage = (props) => {
    const { login, authUser, logout, registerUser } = useFirebase();
    const [chatField,setChatField]= useState('')
    const messages = ChatMessages()
    const [loginValue,setLogin] = useState("")
    const [passwordValue,setPassword] = useState("")
    const [registerLoginValue,setRegLogin] = useState("")
    const [registerPasswordValue,setRegPassword] = useState("")


    return authUser ? (
            <div>
            chat
            <br/>
            <button onClick={() => {logout()}}>logout</button>
                <br/>
            <textarea value={chatField} onChange={(e)=>{setChatField(e.target.value)}} ></textarea>
            <button onClick={()=>{sendMessage(chatField, loginValue); setChatField('')}} >button</button>
           <MassageBody msgs={messages} />
                </div>
           ) : ( <div>
            <input type="text" value={loginValue} onChange={(e)=>{setLogin(e.target.value)}}/>
            <input type ="password" value={passwordValue} onChange={(e)=>{setPassword(e.target.value)}}/>
            <button onClick={()=> {login(loginValue, passwordValue)}}>login</button>
            <br/>
            <input type="email" value={registerLoginValue} onChange={(e)=>{setRegLogin(e.target.value)}}/>
            <input type ="password" value={registerPasswordValue} onChange={(e)=>{setRegPassword(e.target.value)}}/>
            <button onClick={()=> {registerUser(registerLoginValue, registerPasswordValue);
            setLogin(registerLoginValue)
            setRegLogin(""); setRegPassword("") }}>REGISTER</button>

        </div>

    )


};

export default ChatPage;