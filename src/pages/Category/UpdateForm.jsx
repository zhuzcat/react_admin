import {Input, Modal} from 'antd';
import {useState, useEffect} from "react";


export default function UpdateForm(props) {
    const {status, onOk, onCancel} = props;
    const [value, setValue] = useState();
    useEffect(() => {
        setValue(status.name)
    }, [status])

    function valueChange(e) {
        setValue(e.target.value)
    }

    return (
        <Modal title="修改分类" visible={status.status === 1} onOk={() => {
            onOk(value)
        }} onCancel={onCancel}>
            <p style={{marginBottom: 20, paddingLeft:5}}>修改分类名称</p>
            <Input value={value} onChange={valueChange}/>
        </Modal>
    )
}