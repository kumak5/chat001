import React, {useState, useEffect, useCallback} from 'react'
import MassageBody from "./MessageBody";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


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

/**
 *
 * @type {firebase.database.Reference} - cылка на базу данных
 */
const chat = firebase.database().ref('test/chat');

/**
 *
 * @param {string} msg - сообщение
 * @param {string} user - имя пользователя
 */
function sendMessage(msg, user) {
    let date = new Date().getTime()
    let id = Date.now() + Math.random()
    chat.push({ id: id, message: msg, date: date, nickname: user})
}

/**
 *
 * @returns {*[]} - хук возврашает массив сообщений
 * @constructor
 */
const useChatMessages = () => {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        chat.on('child_added', snapshot => {
            const newMessage = snapshot.val();
            if (!messages.some(message => message.id == newMessage.id)) {
                setMessages([...messages, newMessage]);
            }
        });
        return () => {
            chat.off('child_added')
        }
    })
    return messages
}

/**
 * authUser - состояние авторизованного пользователя
 * login - авторизация пользователя
 * logout - выход пользователя
 * registerUser - регистрация пользователя
 *
 * Хук - возврашает интерфейс управления firebase
 * @returns {{login , authUser, logout, registerUser}}
 */

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
        })
        .catch((error) => { //report any errors
        }) ,[])

    return { login, authUser, logout, registerUser }
}


/**
 *
 * @returns {*} - возвращает состояние странцы авторизованного или не авторизованного пользователя с возможностями управления
 * @constructor
 */
const ChatPage = () => {
    const { login, authUser, logout, registerUser } = useFirebase();
    const [chatField,setChatField]= useState('')
    const messages = useChatMessages()
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
            <br/>
            email, password (>= 6)
        </div>

    )


};

export default ChatPage;