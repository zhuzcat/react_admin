import {Form, Input, Select} from "antd";
import {useState, useEffect, useImperativeHandle, forwardRef} from "react";

const {Item} = Form;
const {Option} = Select;

export default forwardRef((props, ref) => {
    const {roles, user} = props
    useEffect(() => {
        form.setFieldsValue({...user})
    }, [user._id])
    const [form] = Form.useForm();
    // 将表单数据传给父组件
    useImperativeHandle(ref, () => ({
        getFormData() {
            if (user._id) {
                return {...form.getFieldsValue(), _id: user._id}
            }
            return form.getFieldsValue();
        },
        resetForm() {
            form.resetFields();
        }
    }))
    return (
        <Form
            form={form}
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
        >
            <Item label='用户名' name='username' rules={[{required: true, whitespace: true, message: '请输入用户名'}]}>
                <Input placeholder="请输入用户名"/>
            </Item>
            <Item label='密码' name='password' rules={[{required: true, whitespace: true, message: "请输入密码"}]}
                  style={{display: user._id ? 'none' : ''}}>
                <Input placeholder="请输入密码" type='password'/>
            </Item>
            <Item label='电话号' name='phone'>
                <Input placeholder="请输入电话号"/>
            </Item>
            <Item label='邮箱' name='email'>
                <Input placeholder="请输入邮箱"/>
            </Item>
            <Item label='角色' wrapperCol={{span: 10}} name='role_id'>
                <Select placeholder='请选择角色'>
                    {
                        roles.map(role => {
                            return <Option value={role._id} key={role._id}>{role.name}</Option>
                        })
                    }
                </Select>
            </Item>
        </Form>
    )
})