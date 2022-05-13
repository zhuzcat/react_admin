import {createSlice} from "@reduxjs/toolkit";
import storageUtils from "@/utils/storageUtils";
import {message} from "antd";
import {userLogin} from "../../api";

const initialState = {
    user: storageUtils.getUser()
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        errMsgUser: (state, action) => {
            state.user = {...state.user, errorMsg: action.payload};
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        resetUser: (state, action) => {
            state.user = storageUtils.getUser();
        }
    }
})

export const {errMsgUser, setUser, resetUser} = userSlice.actions;
export const loginAction = (user) => async (dispatch) => {
    const res = await userLogin(user);
    if (res.status === 0) {
        console.log(1)
        storageUtils.setUser(res.data);
        dispatch(setUser(res.data));
        message.success('登录成功');
    } else {
        console.log(2)
        message.error(res.msg);
        dispatch(errMsgUser(res.msg));
    }
}

export const logoutAction = () => (dispatch) => {
    storageUtils.removeUser();
    dispatch(resetUser());
}
export default userSlice.reducer;