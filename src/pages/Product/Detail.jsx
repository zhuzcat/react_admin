import {useLocation, Navigate, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {List, Card, Image} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqCategory} from "@/api";
import './detail.less'

const {Item} = List;

export default function Detail() {
    const navigate = useNavigate();
    const location = useLocation();
    // 初始化分类信息
    const [category, setCategory] = useState({categoryName: '', categoryName2: ''});
    // 定义发送请求获取分类信息的函数
    const getCategory = async (categoryId, pCategoryId) => {
        const results = Promise.all(
            [reqCategory(categoryId), reqCategory(pCategoryId)]
        )
        const [category, pCategory] = await results;
        setCategory({
            categoryName: category.data.name,
            categoryName2: pCategory.data.name
        })
    }
    // 发送请求获取分类信息
    useEffect(() => {
        const {categoryId, pCategoryId} = location.state;
        getCategory(categoryId, pCategoryId).catch(err => {
        })
    }, [])
    // 判断是否有state参数
    if (!location.state) {
        return <Navigate to="/product"/>
    }
    return (
        <Card title={<div><h3><a style={{marginRight: 10}} onClick={() => {
            navigate(-1)
        }}><ArrowLeftOutlined/></a>商品详情</h3></div>}>
            <List size='large'>
                <Item>
                    <div className='list-item'><h3>商品名称:</h3><h4>{location.state.name}</h4></div>
                </Item>
                <Item>
                    <div className='list-item'><h3>商品描述:</h3><h4>{location.state.desc}</h4></div>
                </Item>
                <Item>
                    <div className='list-item'><h3>商品价格:</h3><h4>￥{location.state.price}</h4></div>
                </Item>
                <Item>
                    <div className='list-item'><h3>所属分类:</h3><h4>{category.categoryName2} / {category.categoryName}</h4>
                    </div>
                </Item>
                <Item>
                    <div className='list-item'>
                        <h3>商品图片:</h3>
                        <Image.PreviewGroup>
                            {location.state.imgs.map((item, index) => {
                                return <Image key={index} src={`http://zzchandsomeboy.top:5000/upload/${item}`}
                                              width={200}/>
                            })}
                        </Image.PreviewGroup>
                    </div>
                </Item>
                <Item>
                    <div><h3 style={{fontWeight: 700}}>商品详情:</h3>
                        <div dangerouslySetInnerHTML={{__html:location.state.detail}}/>
                    </div>
                </Item>
            </List>
        </Card>
    );
}