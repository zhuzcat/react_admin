import {lazy, Suspense} from "react";
import {Navigate} from "react-router-dom";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";

const Home = lazy(() => import("@/pages/Home"));
const Product = lazy(() => import("@/pages/Product"));
const Category = lazy(() => import("@/pages/Category"));
const User = lazy(() => import("@/pages/User"));
const Role = lazy(() => import("@/pages/Role"));
const Charts = lazy(() => import("@/pages/Charts"));
const Bar = lazy(() => import("@/pages/Charts/Bar"));
const Line = lazy(() => import("@/pages/Charts/Line"));
const Pie = lazy(() => import("@/pages/Charts/Pie"));
const AddOrUpdate = lazy(() => import("@/pages/Product/AddOrUpdate"));
const ProductHome = lazy(() => import("@/pages/Product/Home"));
const ProductDetail = lazy(() => import("@/pages/Product/Detail"));
export const routes = [
    {
        path: '/',
        component: <Admin/>,
        children: [
            {
                path: '/',
                component: <Navigate to="/home"/>,
            },
            {
                path: '/home',
                component: <Home/>,
            },
            {
                path: 'product',
                component: <Product/>,
                children: [
                    {
                        path: '/product',
                        component: <ProductHome/>
                    },
                    {
                        path: 'addorupdate',
                        component: <AddOrUpdate/>,
                    },
                    {
                        path: 'detail',
                        component: <ProductDetail/>,
                    }
                ]
            },
            {
                path: 'category',
                component: <Category/>,
            },
            {
                path: 'user',
                component: <User/>,
            },
            {
                path: 'role',
                component: <Role/>,
            },
            {
                path: 'charts',
                component: <Charts/>,
                children: [
                    {
                        path: 'bar',
                        component: <Bar/>,
                    },
                    {
                        path: 'line',
                        component: <Line/>,
                    },
                    {
                        path: 'pie',
                        component: <Pie/>,
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: <Login/>
    },

]

// ???????????????????????????Suspense???????????????
function changeRoutes(routes) {
    return routes.map(item => {
        if (item.children) {
            item.children = changeRoutes(item.children)
        }
        // ????????????component??????Suspense????????????element???
        item.element =
            (<Suspense fallback={<h1>loading...</h1>}>
                {item.component}
            </Suspense>)
        return item
    })
}

export default changeRoutes(routes)