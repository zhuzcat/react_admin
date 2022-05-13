import {Upload, Modal, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useState, useImperativeHandle, forwardRef} from "react";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default forwardRef((props, ref) => {
    // 图片列表
    let fileList = []
    // 判断是修改还是新增
    if (props.fileList.length > 0) {
        // 将fileList的格式转换成antd的格式
        fileList = props.fileList.map((item, index) => {
            return {
                uid: index,
                name: item,
                status: 'done',
                url: `http://zzchandsomeboy.top:5000/upload/${item}`
            }
        })
    }
    // 初始化数据
    const [imgs, setImgs] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [...fileList]
    });
    // 取消预览
    const handleCancel = () => setImgs({...imgs, previewVisible: false});
    // 预览图片
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        console.log(file)
        setImgs({
            ...imgs,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    // 图片上传
    const handleChange = ({file, fileList}) => {
        // 整合数据
        if (file.status === 'done') {
            if (file.response.status === 0) {
                message.success('上传图片成功')
                file.name = file.response.data.name
            } else {
                message.error('上传图片失败')
            }
        }
        setImgs({...imgs, fileList})
    };
    // 向父组件传递图片数据
    useImperativeHandle(ref, () => ({
        getImgs: () => {
            return imgs.fileList.map(item => item.name)
        }
    }))
    // 上传的按钮
    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );
    return (
        <div>
            <Upload
                action="/api/manage/img/upload"
                listType="picture-card"
                fileList={imgs.fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                name='image'
            >
                {imgs.fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal
                visible={imgs.previewVisible}
                title={imgs.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{width: '100%'}} src={imgs.previewImage}/>
            </Modal>
        </div>
    )
})