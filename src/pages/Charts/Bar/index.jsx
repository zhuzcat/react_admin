import {Card, Button} from 'antd'
import {useState} from "react";
import ReactEcharts from 'echarts-for-react'

export default function Bar() {
    const [barState, setBarState] = useState({
        sales: [5, 20, 36, 10, 10, 20], // 销量的数组
        stores: [6, 10, 25, 20, 15, 10], // 库存的数组
    })

    const update = () => {
        setBarState({
            sales: barState.sales.map(x => x + 1),
            stores: barState.stores.map(x => x - 1),
        })
    }

    /*
    返回柱状图的配置对象
     */
    const getOption = (sales, stores) => {
        return {
            title: {
                text: '销量情况'
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: sales
            }, {
                name: '库存',
                type: 'bar',
                data: stores
            }]
        }
    }
    return (
        <div>
            <Card title={<Button type='primary' onClick={update}>更新</Button>}>
                <ReactEcharts option={getOption(barState.sales, barState.stores)}/>
            </Card>
        </div>
    )
}