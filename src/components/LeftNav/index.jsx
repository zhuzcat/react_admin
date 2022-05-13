import {Menu} from "antd";
import {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import menuItem from '@/config/menuConfig';
import storageUtils from "@/utils/storageUtils";
import './index.less'

// 判断是否有权限
function isAuth(item) {
    const {key, children} = item;
    const {role: {menus}, username} = storageUtils.getUser()
    if (username === 'admin' || menus.indexOf(key) !== -1 || key === '/home') {
        return true;
    } else {
        if (children) {
            return children.some(child => menus.indexOf(child.key) !== -1)
        }
    }
    return false;
}

// 获取应该展示的菜单
function getMenuNodes(menuList) {
    return menuList.reduce((pre, item) => {
        if (isAuth(item)) {
            if (!item.children) {
                pre.push({...item})
            } else {
                pre.push({...item, children: getMenuNodes(item.children)})
            }
        }
        return pre
    }, [])
}

export default function LeftNav() {
    const menuNodes = getMenuNodes(menuItem);
    // 获取当前的pathname需要的方法
    const location = useLocation();
    const navigate = useNavigate();

    // 展开的menu
    function getOpenKeys() {
        // 获取当前的pathname需要的方法
        let key = ''
        menuItem.forEach(item => {
            if (item.children && item.children.find(child => child.key === location.pathname)) {
                key = item.key
            }
        })
        return key
    }

    //点击菜单事件，进行路由跳转
    async function menuSelect({key}) {
        navigate(key)
    }

    // 初始化展开的menu
    const [openKeys, setOpenKeys] = useState([getOpenKeys()]);

    // 当前选中的menu
    function openChange(keys) {
        setOpenKeys(keys)
    }

    return (
        <div>
            <div className="logo">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="logo"/>
                <h2>后台管理系统</h2>
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuNodes} onClick={menuSelect}
                  selectedKeys={location.pathname} openKeys={openKeys} onOpenChange={openChange}/>
        </div>
    )
}