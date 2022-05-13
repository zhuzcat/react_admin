import {Card, Table, Button, message, Modal} from "antd";
import {useState, useEffect, useRef} from "react";
import {reqGetUsers, reqDeleteUser, reqAddUser, reqUpdateUser} from '@/api'
import UserForm from "./UserForm";

export default function User() {
    // 初始化数据
    const [users, setUsers] = useState({users: [], roles: [], loading: true})
    const [isShow, setIsShow] = useState(false)
    const [user, setUser] = useState({
        username: '',
        password: '',
        email: undefined,
        phone: undefined,
        role_id: undefined
    })
    const userRef = useRef()
    // 获取用户数据的方法
    const getUsers = async () => {
        const result = await reqGetUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            setUsers({users, roles, loading: false})
        } else {
            throw new Error('获取用户数据失败')
        }
    }
    // 获取用户数据
    useEffect(() => {
        getUsers().catch(err => message.error(err))
    }, [])
    // 获取id对应的roles的方法
    const getRoles = (id) => {
        return users.roles.find(role => role._id === id)?.name
    }
    // 删除用户的方法
    const deleteUser = (user) => {
        Modal.confirm({
            title: '确认删除?',
            content: `您确定要删除${user.username}吗?`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除成功')
                    getUsers().catch(err => message.error(err))
                } else {
                    message.error('删除失败')
                }
            },
        })
    }
    // 验证表单的方法
    const validateUser = (user) => {
        if (user.username.trim().length === 0) {
            message.error('用户名不能为空')
            return false
        }
        if (user.password.trim().length === 0) {
            message.error('密码不能为空')
            return false
        }
        // 判断手机号是否合法
        const reg2 = /^1[3456789]\d{9}$/
        if (user.phone && !reg2.test(user.phone)) {
            message.error('手机号格式不正确')
            return false
        }
        // 判断邮箱是否合法
        const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if (user.email && !reg.test(user.email)) {
            message.error('邮箱格式不正确')
            return false
        }
        return true
    }
    // 显示新增用户
    const showAddUser = () => {
        setIsShow(true)
        setUser({username: '', password: '', email: undefined, phone: undefined, role_id: undefined})
    }
    // 显示编辑用户
    const showEditUser = (user) => {
        setIsShow(true)
        setUser({email: undefined, phone: undefined, role_id: undefined, ...user,})
    }
    // 新增或修改用户的方法
    const addOrUpdateUser = async () => {
        const user = userRef.current.getFormData()
        if (validateUser(user)) {
            let result
            if (user._id) {
                console.log(6)
                result = await reqUpdateUser(user)
            } else {
                result = await reqAddUser(user)
            }
            if (result.status === 0) {
                message.success('操作成功')
                getUsers().catch(err => message.error(err))
                setIsShow(false)
                userRef.current.resetForm()
            } else {
                message.error(result.msg)
            }
        }
    }

    // 初始化columns的函数
    function initColumns() {
        return [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: (create_time) => {
                    return new Date(create_time).toLocaleString();
                }
            },
            {
                title: '角色',
                dataIndex: 'role_id',
                key: 'role_id',
                render: (role_id) => {
                    return getRoles(role_id)
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (user) => {
                    return (
                        <span>
                            <a style={{marginRight: 10}} onClick={() => showEditUser(user)}>修改</a>
                            <a onClick={() => {
                                deleteUser(user)
                            }}>删除</a>
                        </span>
                    )
                }
            }
        ]
    }

    return (
        <div>
            <Card title={<Button type='primary' onClick={showAddUser}>创建用户</Button>}>
                <Table
                    rowKey='_id'
                    dataSource={users.users}
                    loading={users.loading}
                    bordered
                    columns={initColumns()}
                    pagination={{
                        pageSize: 5,
                    }}
                >
                </Table>
            </Card>
            <Modal
                title={user._id ? '修改用户' : '创建用户'}
                visible={isShow}
                onOk={addOrUpdateUser}
                onCancel={() => {
                    setIsShow(false)
                }}
                okText='确认'
                cancelText='取消'
            >
                <UserForm ref={userRef} roles={users.roles} user={user}/>
            </Modal>
        </div>
    )
}