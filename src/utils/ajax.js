import axios from "axios";
import {message} from "antd";

const baseURL = "/api";
const timeout = 10000;

// 创建axios实例
const service = axios.create({
    baseURL,
    timeout
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        message.error("请求失败");
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        message.error("请求失败");
        return Promise.reject(error);
    }
);

export default service;