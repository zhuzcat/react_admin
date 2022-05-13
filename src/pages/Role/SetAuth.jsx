import {Form, Input, Tree} from 'antd';
import {forwardRef, useImperativeHandle, useState, useEffect} from "react";
import menuList from '@/config/menuConfig';

const {TreeNode} = Tree;

const treeData = [{
    label: "平台权限",
    key: 'all',
    children: menuList
}]
export default forwardRef((props, ref) => {
    const [checkedKeys, setCheckedKeys] = useState([]);
    useEffect(() => {
        setCheckedKeys(props.menus)
    }, [props.id])
    // 选择权限的回调
    const onCheck = (checkedKeys) => {
        setCheckedKeys(checkedKeys);
    }
    // 将选择的权限传给父组件
    useImperativeHandle(ref, () => ({
        getCheckedKeys() {
            return checkedKeys;
        }
    }))
    return (
        <div>
            <Form>
                <Form.Item label="角色名称">
                    <Input value={props.name} disabled/>
                </Form.Item>
            </Form>
            <Tree
                fieldNames={{
                    children: 'children',
                    title: 'label',
                    key: 'key'
                }}
                treeData={treeData}
                defaultExpandAll={true}
                checkable={true}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
            />
        </div>
    )
})
