import {useRef,useEffect} from "react";
import {Form, Input, Button, Checkbox, message} from "antd";
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useNavigate, Navigate} from "react-router-dom";
import {userLogin} from "@/api";
import storageUtils from "@/utils/storageUtils";
import './login.less'

export default function Login() {
    const passwordRef = useRef(null);
    // 编程式导航的hooks
    const navigate = useNavigate();

    // 表单
    const [form] = Form.useForm();

    // 表单验证规则
    const rules = [
        {
            required: true,
            whitespace: true,
            message: '请输入用户名',
        },
        {
            min: 4,
            max: 18,
            message: '输入长度为4-18位',
        },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '用户名只能包含字母、数字和下划线',
        },
    ];

    // 表单提交事件
    async function submitLogin() {
        const username = form.getFieldValue('username');
        const password = form.getFieldValue('password');
        try {
            const res = await userLogin({username, password});
            if (res.status === 0) {
                message.success('登录成功');
                storageUtils.setUser(res.data);
                navigate('/', {replace: true});
            } else {
                message.error(res.msg);
                form.setFieldsValue({password: ''})
                passwordRef.current.focus();
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 判断是否已经登录
    if (storageUtils.getUser() && storageUtils.getUser()._id) {
        return <Navigate to='/' replace={true}/>
    }

    return (
        <div className="login">
            <header className="login-header">
                <h2>商城后台管理系统</h2>
                <p>一个基于react实现的后台管理系统</p>
            </header>
            <section className="login-section">
                <Form
                    form={form}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                    onFinish={submitLogin}
                >
                    <Form.Item
                        name="username"
                        rules={rules}
                    >
                        <Input prefix={<UserOutlined/>} size="large" placeholder="用户名"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={rules}
                    >
                        <Input.Password prefix={<LockOutlined/>} size="large" placeholder="密码" ref={passwordRef}/>
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                    >
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <Form.Item
                    >
                        <Button type="primary" htmlType="submit" className="form-button" size="large">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        </div>
    );
}