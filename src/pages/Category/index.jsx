import {Card, Button, Table, Space, Breadcrumb, Modal, Form, Input} from "antd";
import {useState, useEffect} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {message} from "antd";
import {reqCategoryList, reqAddCategory, reqUpdateCategory} from '@/api'
import UpdateForm from "./UpdateForm";
import AddForm from "./AddForm";

let columns = [];

export default function () {
    // 初始化state数据
    const [data, setData] = useState([])
    // 初始化loading数据
    const [loading, setLoading] = useState(true)
    // 初始化parent数据
    const [parent, setParent] = useState({parentId: '0', parentName: ''})
    // 初始化添加和修改分类的弹窗
    const [showStatus, setShowStatus] = useState({status: 0})

    // 定义发送请求的函数
    async function getCategoryList() {
        const result = await reqCategoryList(parent.parentId)
        if (result.status === 0) {
            setData(result.data)
            setLoading(false)
        } else {
            throw new Error('获取分类列表失败')
        }
    }

    // 在组件渲染完成后发送请求
    useEffect(() => {
        getCategoryList().catch(err => {
            message.error(err.message)
        })
        columns = getColumns()
    }, [parent.parentId])

    // 修改分类级别
    function changeLevel(text, record) {
        setParent({
            parentId: record._id,
            parentName: record.name
        })
        setLoading(true)
    }

    // table表头
    function getColumns() {
        return [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: '_id',
                width: '70%',
            },
            {
                title: "操作",
                dataIndex: 'action',
                key: "action",
                width: '30%',
                render: (text, record) =>
                    parent.parentId === '0' ?
                        (
                            <Space size='middle'>
                                <a onClick={() => {
                                    showModal(1, record)
                                }}>修改分类</a>
                                <a onClick={() => {
                                    changeLevel(text, record)
                                }}>查看子分类</a>
                            </Space>
                        ) :
                        (
                            <Space size='middle'>
                                <a onClick={() => {
                                    showModal(1, record)
                                }}>修改分类</a>
                            </Space>
                        )
            }
        ]
    }

    // 设置卡片的title
    function getTitle() {
        return parent.parentId === '0' ? '一级分类列表' : (
            <Breadcrumb separator='>'>
                <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={() => {
                    changeLevel('', {_id: '0', name: ''})
                }}>一级分类列表</Breadcrumb.Item>
                <Breadcrumb.Item>{parent.parentName}</Breadcrumb.Item>
            </Breadcrumb>
        )
    }

    // 显示添加和修改分类的弹窗
    function showModal(status, record) {
        if (record) {
            setShowStatus({status, name: record.name, id: record._id})
        } else {
            setShowStatus({status, parentName: parent.parentName})
        }
    }

    // 取消添加和修改分类的弹窗
    function handleCancel() {
        setShowStatus({status: 0})
    }

    // 修改分类
    async function handleUpdate(values) {
        if (values.trim().length === 0) {
            message.error('分类名称不能为空')
        } else {
            let result = await reqUpdateCategory(showStatus.id, values)
            if (result.status === 0) {
                message.success('修改分类成功')
                // 刷新列表
                getCategoryList().catch(err => {
                    message.error(err.message)
                })
                setShowStatus({status: 0})
            }
        }
    }

    // 添加分类
    async function handleAdd(values) {
        if (values.trim().length === 0) {
            message.error('分类名称不能为空')
        } else {
            let result = await reqAddCategory(parent.parentId, values)
            if (result.status === 0) {
                message.success('添加分类成功')
                // 刷新列表
                getCategoryList().catch(err => {
                    message.error(err.message)
                })
                setShowStatus({status: 0})
            } else {
                message.error(result.msg)
            }
        }
    }

    return (
        <Card title={getTitle()} bordered loading={loading}
              extra={<Button onClick={() => {
                  showModal(2)
              }} type='primary' icon={<PlusOutlined/>}>添加</Button>}>
            <Table dataSource={data} columns={columns} bordered rowKey='_id'
                   pagination={{
                       defaultPageSize: 5,
                       showQuickJumper: true,
                       showSizeChanger: true,
                       pageSizeOptions: ['3', '5', '10'],
                       showTotal: (total) => `共${total}条数据`
                   }}/>
            <UpdateForm status={showStatus} onOk={handleUpdate} onCancel={handleCancel}/>
            <AddForm status={showStatus} onOk={handleAdd} onCancel={handleCancel}/>
        </Card>
    )
}