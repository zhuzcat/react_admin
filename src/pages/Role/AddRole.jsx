import {Form, Input} from 'antd';
import {useImperativeHandle, forwardRef, useEffect} from "react";

export default forwardRef((props, ref) => {
    // 表单数据
    const [form] = Form.useForm();
    // 将表单数据传递给父组件
    useImperativeHandle(ref, () => ({
        getFormData() {
            return form.getFieldsValue();
        },
        resetForm() {
            form.resetFields();
        }
    }));
    return (
        <div>
            <Form form={form}>
                <Form.Item label="角色名称" name='name' rules={[{required: true, message: '请输入角色名称'}]}>
                    <Input placeholder="请输入角色名称"/>
                </Form.Item>
            </Form>
        </div>
    )
})