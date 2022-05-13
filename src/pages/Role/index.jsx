import {Button, Card, message, Modal, Table} from "antd";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import AddRole from "./AddRole";
import SetAuth from "./SetAuth";
import {reqAddRole, reqRoleList, reqUpdateRole} from "@/api";
import storageUtils from "@/utils/storageUtils";

const columns = [
    {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'createTime',
        render: (create_time) => {
            return new Date(create_time).toLocaleString();
        }
    },
    {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'authorizeTime',
        render: (auth_time) => {
            if (!auth_time) {
                return '';
            }
            return new Date(auth_time).toLocaleString()
        }
    },
    {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'authorizeUser',
    }
]
export default function Role() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState({})
    const [addVisible, setAddVisible] = useState(false);
    const [authVisible, setAuthVisible] = useState(false);
    // 获取添加角色的弹窗的ref
    const addRef = useRef()
    // 获取授权的弹窗的ref
    const authRef = useRef()
    // 获取角色列表的方法
    const getRoles = async () => {
        const result = await reqRoleList()
        if (result.status === 0) {
            setRoles(result.data)
            setLoading(false)
        } else {
            throw new Error('获取角色列表失败')
        }
    }
    // 在组件挂载的时候获取角色列表
    useEffect(() => {
        getRoles().catch(err => message.error(err))
    }, [])
    // 选择某一时的回调
    const onSelect = (record) => {
        return {
            onClick: () => {
                setRole(record)
            }
        }
    }
    // 添加角色的回调
    const addRole = async () => {
        if (addRef.current.getFormData().name) {
            const result = await reqAddRole({roleName: addRef.current.getFormData().name})
            if (result.status === 0) {
                message.success('添加角色成功')
                setRoles([...roles, result.data])
                setAddVisible(false)
                addRef.current.resetForm()
            } else {
                message.error('添加角色失败')
            }
        } else {
            return null
        }
    }
    // 设置权限的回调
    const setAuth = async () => {
        role.menus = authRef.current.getCheckedKeys()
        role.auth_time = Date.now()
        role.auth_name = storageUtils.getUser().username
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            if (role._id === storageUtils.getUser().role._id) {
                storageUtils.removeUser()
                message.info('用户所属角色权限被修改，请重新登录')
                navigate('/login')
            } else {
                message.success('设置权限成功')
                getRoles().catch(err => message.error(err))
                setAuthVisible(false)
            }
        } else {
            message.error('设置权限失败')
        }
    }
    // card的title
    const title = (
        <div>
            <Button type='primary' style={{marginRight: 10}} onClick={() => {
                setAddVisible(true)
            }}>创建角色</Button>
            <Button type='primary' disabled={!role._id} onClick={() => {
                setAuthVisible(true)
            }}>设置角色权限</Button>
        </div>
    )
    return (
        <div>
            <Card title={title}>
                <Table
                    loading={loading}
                    rowKey='_id'
                    dataSource={roles}
                    columns={columns}
                    bordered
                    onRow={onSelect}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (record) => {
                            setRole(record)
                        }
                    }}
                    pagination={{
                        pageSize: 5,
                        showTotal: (total) => `共 ${total} 条数据`
                    }}
                />
            </Card>
            <Modal visible={addVisible} title="添加角色" onOk={addRole} onCancel={() => {
                setAddVisible(false)
                addRef.current.resetForm()
            }}>
                <AddRole ref={addRef}/>
            </Modal>
            <Modal visible={authVisible} title="设置角色权限" onOk={setAuth} onCancel={() => {
                setAuthVisible(false)
            }}>
                <SetAuth ref={authRef} name={role.name} menus={role.menus || []} id={role._id}/>
            </Modal>
        </div>
    )
}
