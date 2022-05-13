import {
    AreaChartOutlined,
    BarChartOutlined,
    HomeOutlined,
    LineChartOutlined,
    MailOutlined,
    PieChartOutlined,
    SafetyCertificateOutlined,
    ToolOutlined,
    UnorderedListOutlined,
    UserOutlined
} from "@ant-design/icons";

export default [
    {
        key: '/home',
        icon: <HomeOutlined/>,
        label: '首页',
    },
    {
        key:'/products',
        label: '商品',
        icon: <MailOutlined/>,
        children: [
            {
                key: '/product',
                label: '商品管理',
                icon: <UnorderedListOutlined/>,
            },
            {
                key: '/category',
                label: '分类管理',
                icon: <ToolOutlined/>
            },
        ],
    },
    {
        label: '用户管理',
        key: '/user',
        icon: <UserOutlined/>,
    },
    {
        label: '角色管理',
        key: '/role',
        icon: <SafetyCertificateOutlined/>
    },
    {
        label: '图形图表',
        key: '/charts',
        icon: <AreaChartOutlined/>,
        children: [
            {
                key: '/charts/bar',
                label: '柱状图',
                icon: <BarChartOutlined/>
            },
            {
                key: '/charts/line',
                label: '折线图',
                icon: <LineChartOutlined/>
            },
            {
                key: '/charts/pie',
                label: '饼图',
                icon: <PieChartOutlined/>
            }
        ]
    }
]