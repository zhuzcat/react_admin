import {useRoutes, useLocation} from 'react-router-dom';
import {Fragment, useEffect} from "react";
import menuItem from '@/config/menuConfig'
import routes from '@/router'

function App() {
    const location = useLocation();

    // 设置标题
    function getTitle() {
        let title = ''
        menuItem.forEach(item => {
            if (item.key === location.pathname) {
                title = item.label
            } else if (item.children) {
                const cItem = item.children.find(child => child.key === location.pathname)
                if (cItem) {
                    title = cItem.label
                }
            }
        })
        return title
    }
    useEffect(() => {
        document.title = getTitle()
        if (location.pathname === '/product/detail') {
            document.title = '商品详情'
        }
        if (location.pathname === '/product/addorupdate') {
            document.title = '添加/修改商品'
        }
    }, [location])
    const element = useRoutes(routes);
    return (
        <Fragment>
            {element}
        </Fragment>
    )
}

export default App