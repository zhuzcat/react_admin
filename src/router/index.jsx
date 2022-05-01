import {lazy, Suspense} from "react";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";

const routes = [
    {
        path: '/',
        component: <Admin/>
    },
    {
        path: '/login',
        component: <Login/>
    }
]


function changeRoutes(routes) {
    return routes.map(item => {
        if (item.children) {
            item.children = changeRoutes(item.children)
        }
        // 将路由的component经过Suspense然后存到element中
        item.element =
            (<Suspense fallback={<h1>loading...</h1>}>
                {item.component}
            </Suspense>)
        return item
    })
}

export default changeRoutes(routes)