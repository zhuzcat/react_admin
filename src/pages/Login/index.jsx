import {useState} from "react";
import {Form, Input, Button, Checkbox} from "antd";
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import './login.less'

// 表单验证
function validateLoginForm(values) {
    if (values.length < 6 || values.length > 18) {
        return {
            validateStatus: 'error',
            errorMsg: '输入长度为6-18位'
        }
    }
    return {
        validateStatus: 'success',
        errorMsg: null,
    }
}

export default function Login() {
    const [username, setUsername] = useState({value: ''});
    const [password, setPassword] = useState({value: ''});

    // 输入框变化事件
    function handleChange({target: {value}}, type) {
        type === 'username' ? setUsername({
            ...validateLoginForm(value),
            value
        }) : setPassword({...validateLoginForm(value), value})
    }

    // 表单提交事件
    function submitLogin() {
        if(username.validateStatus === 'error' || password.validateStatus === 'error') {
            return
        }
        console.log(username.value, password.value)
    }

    return (
        <div className="login">
            <header className="login-header">
                <h2>商城后台管理系统</h2>
                <p>一个基于react实现的后台管理系统</p>
            </header>
            <section className="login-section">
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                    onFinish={submitLogin}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                        validateStatus={username.validateStatus}
                        help={username.errorMsg}
                    >
                        <Input prefix={<UserOutlined/>} size="large" placeholder="用户名" value={username.value}
                               onChange={(value) => {
                                   handleChange(value, 'username')
                               }}/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                        validateStatus={password.validateStatus}
                        help={password.errorMsg}
                    >
                        <Input.Password prefix={<LockOutlined/>} size="large" placeholder="密码" value={password.value}
                                        onChange={(value) => {
                                            handleChange(value, 'password')
                                        }}/>
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