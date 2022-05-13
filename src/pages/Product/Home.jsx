import {Card, Form, Input, Select, Button, Table, message} from 'antd';
import {useState, useEffect} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {reqProductList, reqSearchProductList, reqUpdateStatus} from "@/api";

const {Option} = Select;

export default function Home() {
    const navigate = useNavigate();
    // 表单数据
    const [form] = Form.useForm();
    // 商品列表以及加载状态
    const [productList, setProductList] = useState({list: [], loading: true});
    // 分页数据
    const [pagination, setPagination] = useState({pageNum: 1, pageSize: 5, pages: 1, total: 0});
    // 查询参数
    const [params, setParams] = useState({selectWay: '', keyword: ''});
    // 获取商品列表的方法
    const getProductList = async () => {
        const {pageNum, pageSize} = pagination;
        // 接受返回的结果
        let result;
        // 判断请求方式
        if (params.selectWay === '') {
            result = await reqProductList(pageNum, pageSize);
        } else {
            result = await reqSearchProductList({pageNum, pageSize, [params.selectWay]: params.keyword});
        }
        if (result.status === 0) {
            const {pages, total, list, pageNum, pageSize} = result.data;
            setPagination({pageNum, pageSize, pages, total});
            setProductList({list, loading: false});
        } else {
            throw new Error('请求数据出错');
        }
    }
    // 在useEffect中获取商品列表
    useEffect(() => {
            getProductList().catch(err => message.error(err))
        },
        [pagination.pageNum, pagination.pageSize, params.selectWay, params.keyword])
    // 翻页
    const onPageChange = (pageNum, pageSize) => {
        if (pageNum === pagination.pageNum && pageSize === pagination.pageSize) return;
        setProductList({list: [], loading: true});
        if (pageSize !== pagination.pageSize) {
            setPagination({...pagination, pageNum: 1, pageSize});
        } else {
            setPagination({...pagination, pageNum});
        }
    }
    // 搜索
    const onSearch = () => {
        const {keyword, selectWay} = form.getFieldsValue();
        if (keyword.trim() === '') {
            message.error('请输入关键字');
            return false;
        }
        setProductList({...productList, loading: true});
        setParams({keyword, selectWay});
        setPagination({...pagination, pageNum: 1});
    }
    // 更新商品状态
    const updateStatus = async (id, status) => {
        const result = await reqUpdateStatus(id, status);
        if (result.status === 0) {
            message.success('更新成功');
            // 刷新列表
            getProductList().catch(err => message.error(err));
        } else {
            throw new Error('更新失败');
        }
    }
    // 搜索商品的表单
    const showForm = (
        <Form layout="inline" form={form} initialValues={{selectWay: 'productName', keyword: ''}}
              onFinish={onSearch}>
            <Form.Item label="搜索方法" name='selectWay'>
                <Select placeholder='请选择搜索方式'>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
            </Form.Item>
            <Form.Item label="关键词" name='keyword'>
                <Input placeholder="请输入关键词"/>
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType="submit">搜索</Button>
            </Form.Item>
        </Form>
    )

    // 初始化columns
    function initColumns() {
        return [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                width: '20%'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
                width: '55%'
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                width: 100,
                render: text => `￥${text}`
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (status, record) => (
                    <div>
                        <Button type='primary' size='large' onClick={() => {
                            updateStatus(record._id, status === 1 ? 2 : 1).catch(err => message.error(err))
                        }}>{status === 1 ? '下架' : '上架'}</Button>
                        <h3 style={{marginTop: 5}}>{status === 1 ? '在售' : '已下架'}</h3>
                    </div>
                )
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <div>
                        <a style={{marginRight: 10}} onClick={() => {
                            navigate('/product/detail', {state: {...record}})
                        }}>详情</a>
                        <a onClick={()=>{
                            navigate('/product/addorupdate', {state: {...record}})
                        }}>修改</a>
                    </div>
                )
            }
        ]
    }

    return (
        <div>
            <Card title={showForm} extra={<Button onClick={() => {
                navigate('/product/addorupdate')
            }} type='primary' icon={<PlusOutlined/>}>添加商品</Button>}>
                <Table dataSource={productList.list} columns={initColumns()} bordered={true}
                       loading={productList.loading}
                       rowKey='_id'
                       pagination={{
                           current: pagination.pageNum,
                           pageSize: pagination.pageSize,
                           total: pagination.total,
                           showQuickJumper: true,
                           showSizeChanger: true,
                           pageSizeOptions: ['5', '10', '15'],
                           onChange: onPageChange,
                           showTotal: () => `共 ${pagination.total} 条数据`
                       }}
                />
            </Card>
        </div>
    );
}