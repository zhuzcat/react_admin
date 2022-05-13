import {Card, Form, Input, Cascader, Button, message} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {reqCategoryList} from '@/api';
import UploadImage from "./UploadImage";
import RichTextEditor from "./RichTextEditor";
import {reqAddProduct, reqUpdateProduct} from '@/api';

const {Item} = Form;
// 初始化分类数据
const optionLists = [
    {
        value: '',
        label: '',
        isLeaf: false,
    },
];

export default function AddOrUpdate() {
    // 表单数据
    const [form] = Form.useForm();
    // 分类数据
    const [options, setOptions] = useState([]);
    // 判断是否为加载状态
    const [loading, setLoading] = useState(true);
    // 获取location信息
    const location = useLocation();
    // 用于路由跳转
    const navigate = useNavigate();
    // 获取上传图片的ref
    const uploadImageRef = useRef();
    // 获取富文本编辑器的ref
    const richTextEditorRef = useRef();
    // 初始化form数据
    const [initFormData, setInitFormData] = useState({
        name: '',
        desc: '',
        price: '',
        categoryId: [],
    });
    // 获取列表数据的方法
    const getCategoryList = async (parentId) => {
        const result = await reqCategoryList(parentId);
        if (result.status === 0) {
            if (parentId === 0) {
                return result.data.map(item => ({
                    value: item._id,
                    label: item.name,
                    isLeaf: false,
                }));
            }
            return result.data.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }));
        } else {
            throw new Error('获取列表数据失败');
        }
    }
    // 定义 初始化列表的方法
    const initOptions = async () => {
        const result = await getCategoryList(0);
        if (location.state) {
            const {pCategoryId, categoryId} = location.state;
            const subResult = await getCategoryList(pCategoryId);
            const targetOption = result.find(item => item.value === pCategoryId);
            targetOption.children = subResult;
            setLoading(false);
        }
        setLoading(false);
        setOptions(result);
    }
    // 初始化一级分类列表
    useEffect(() => {
        initOptions().catch(err => message.error(err));
        if (location.state) {
            console.log(location.state)
            setInitFormData({
                name: location.state.name,
                desc: location.state.desc,
                price: location.state.price,
                categoryId: [location.state.pCategoryId, location.state.categoryId],
            })
        }
    }, [])
    // 定义 初始化二级分类列表的方法
    const loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const result = await reqCategoryList(targetOption.value);
        if (result.status === 0) {
            const list = result.data.map(item => {
                    return {
                        value: item._id,
                        label: item.name,
                    }
                }
            );
            targetOption.loading = false;
            targetOption.children = list;
            setOptions([...options]);
        } else {
            targetOption.loading = false;
            message.error('请求分类列表失败');
        }
    }
    // 定义 提交表单的方法
    const onFinish = async () => {
        const product = {
            name: form.getFieldValue('name'),
            desc: form.getFieldValue('desc'),
            price: form.getFieldValue('price'),
            categoryId: form.getFieldValue('categoryId')[1],
            pCategoryId: form.getFieldValue('categoryId')[0],
            imgs: uploadImageRef.current.getImgs(),
            detail: richTextEditorRef.current.getContent(),
        }
        if (location.state) {
            product._id = location.state._id;
            const result = await reqUpdateProduct(product);
            if (result.status === 0) {
                message.success('修改商品成功');
                navigate('/product');
            } else {
                message.error('修改商品失败');
            }
        } else {
            const result = await reqAddProduct(product);
            if (result.status === 0) {
                message.success('添加商品成功');
                navigate('/product');
            } else {
                message.error('添加商品失败');
            }
        }
    }

    return (
        <Card loading={loading} title={<div><a onClick={() => {
            navigate(-1)
        }} style={{marginRight: 10}}><ArrowLeftOutlined/></a><span>{location.state ? '修改商品' : '添加商品'}</span></div>}>
            <Form labelCol={{span: 2}} wrapperCol={{span: 8}} form={form} onFinish={onFinish}
                  initialValues={initFormData}>
                <Item name='name' label="商品名称" rules={[{required: true, whitespace: true, message: "请输入商品名称"}]}>
                    <Input placeholder="请输入商品名称"/>
                </Item>
                <Item name='desc' label="商品描述" rules={[{required: true, whitespace: true, message: "请输入商品描述"}]}>
                    <Input.TextArea placeholder="请输入商品描述"/>
                </Item>
                <Item name='price' label="商品价格"
                      rules={[
                          {required: true, message: "请输入商品价格"},
                          {validator: (_, value) => value > 0 ? Promise.resolve() : Promise.reject("价格必须大于0")}
                      ]}>
                    <Input placeholder="请输入商品价格" prefix="￥" suffix="RMB" type='number'/>
                </Item>
                <Item name='categoryId' label="商品分类" rules={[{required: true, message: "请选择商品分类"},
                    {
                        validator: (_, value) => value.length < 2 ? Promise.reject('请选择完整的分类') : Promise.resolve()
                    }]}>
                    <Cascader options={options} loadData={loadData} changeOnSelect={true}/>
                </Item>
                <Item label="商品图片">
                    <UploadImage fileList={location.state?.imgs || []} ref={uploadImageRef}/>
                </Item>
                <Item label='商品详情' wrapperCol={{span: 18}}>
                    <RichTextEditor ref={richTextEditorRef} detail={location.state?.detail}/>
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Item>
            </Form>
        </Card>
    )
}