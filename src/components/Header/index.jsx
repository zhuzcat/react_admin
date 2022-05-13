import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Modal} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import storageUtils from "@/utils/storageUtils";
import dateUtils from "@/utils/dateUtils";
import {getUserAddress, getWeather} from "@/api";
import './index.less'

const {confirm} = Modal;

export default function Header() {
    // 存储用户信息
    const [userInfo, setUserInfo] = useState({});
    const [date, setDate] = useState(dateUtils());
    // 初始化navigate
    const navigate = useNavigate();

    // 发送请求的方法
    async function getInfo() {
        const res = await getUserAddress();
        const weather = await getWeather(res.data.adcode);
        console.log(weather)
        setUserInfo({
            city: res.data.city,
            province: res.data.province,
            adcode: res.data.adcode,
            weather: weather.data.lives[0].weather,
            temperature: weather.data.lives[0].temperature
        });
    }

    // 发送请求
    useEffect(() => {
        getInfo().catch(err => {
        })
        let timer = setInterval(() => {
            setDate(dateUtils())
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [])

    // 点击退出登录
    function logout() {
        confirm({
            title: '确定退出登录吗?',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                storageUtils.removeUser();
                navigate('/login', {replace: true})
            },
            onCancel() {
            },
        });
    }

    return (
        <div className='header'>
            <div className='header-left'>
                <span>{userInfo.province || '暂无信息'}</span>
                <span>{userInfo.city}</span><span>🌤 {userInfo.weather}</span>
                <span>{userInfo.temperature}℃</span>
                <span style={{color: '#ccc'}}>{date}</span>
            </div>
            <div className='header-right'>
                <span>你好 ,{storageUtils.getUser().username} </span>
                <a onClick={logout}>退出</a>
            </div>
        </div>
    )
}