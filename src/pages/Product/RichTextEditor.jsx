import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {useState, forwardRef, useImperativeHandle} from "react";
import axios from "axios";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default forwardRef((props, ref) => {
    let contentBlock = htmlToDraft(props.detail || "");
    let contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    // 初识化编辑器
    const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

    // 更新编辑器内容
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    }
    // 获取编辑器内容
    const getContent = () => {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }
    // 上传图片
    function uploadImageCallBack(file) {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = `http://zzchandsomeboy.top:5000/upload/${response.data.name}`;
                    resolve({data: {link: url}});
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }
    // 将编辑器内容设置到父组件
    useImperativeHandle(ref, () => {
            return {
                getContent
            }
        }
    )
    return (
        <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onEditorStateChange}
            editorStyle={{border: '1px solid #000', minHeight: '200px', padding: '10px'}}
            toolbar={{
                image: {
                    uploadCallback:uploadImageCallBack,
                    alt: {
                        present: true,
                        mandatory: true
                    }
                }
            }}
        />
    );
})