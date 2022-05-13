import {Input, Modal} from 'antd';
import {useState, useEffect} from "react";


export default function AddForm(props) {
    const {status, onOk, onCancel} = props;
    const [name, setName] = useState('');
    const [parentName, setParentName] = useState(status.parentName);
    useEffect(() => {
        if (status.parentName === '') {
            setParentName('一级分类');
        } else {
            setParentName(status.parentName);
        }
    }, [status]);

    function nameChange(e) {
        setName(e.target.value);
    }

    function handleAdd() {
        setName('');
        onOk(name);
    }

    return (
        <Modal title="添加" visible={status.status === 2} onOk={handleAdd} onCancel={onCancel}>
            <h2>当前级别：{parentName}</h2>
            <p>名称：</p>
            <Input placeholder='请输入要添加的分类名称' onChange={nameChange} value={name}/>
        </Modal>
    )
}