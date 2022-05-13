import store from 'store'
const USER_KEY = 'user_key'

export default {
    getUser(){
        return store.get(USER_KEY)||{}
    },
    setUser(user){
        store.set(USER_KEY, user)
    },
    removeUser(){
        store.remove(USER_KEY)
    }
}