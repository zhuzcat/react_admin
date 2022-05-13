import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useState} from "react";
import {Layout, Menu, message} from 'antd';
import AdminHeader from '@/components/Header';
import LeftNav from "@/components/LeftNav";
import {useSelector} from "react-redux";
import './index.less'

const {Header, Content, Footer, Sider} = Layout;

export default function Admin() {
    const location = useLocation();
    const user = useSelector(state => state.user.user);
    const [marginLeft, setMarginLeft] = useState(200);

    // 判断是否登录
    if (!user || !user._id) {
        return <Navigate to='/login' replace={true}/>
    }
    // 判断是否有权限
    const {menus} = user.role;
    if (menus.indexOf(location.pathname) === -1 && location.pathname !== '/' && user.username !== 'admin') {
        message.info('您没有权限访问')
        return <Navigate to='/' replace={true}/>
    }

    // 设置主窗体的左侧margin
    function changeLeft() {
        if (marginLeft === 200) {
            setMarginLeft(80);
        } else {
            setMarginLeft(200);
        }
    }

    return (
        <div>
            <Layout
                hasSider
                style={{
                    minHeight: '100vh',
                }}
            >
                <Sider collapsible style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                }}
                       onCollapse={changeLeft}
                >
                    <LeftNav/>
                </Sider>
                <Layout className="site-layout" style={{marginLeft, transition: 'all 0.2s'}}>
                    <Header
                        className="site-layout-background big-header"
                        style={{
                            padding: "0 15px",
                        }}
                    >
                        <AdminHeader/>
                    </Header>
                    <Content
                        style={{
                            margin: '16px 16px',
                        }}
                    >
                        <div
                            className="site-layout-background"
                            style={{
                                minHeight: 200,
                            }}
                        >
                            <Outlet/>
                        </div>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                            color: '#ccc'
                        }}
                    >
                        建议使用谷歌浏览器
                    </Footer>
                </Layout>
            </Layout>
        </div>
    );
}