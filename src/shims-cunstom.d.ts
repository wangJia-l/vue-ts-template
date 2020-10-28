import * as axios from 'axios';
import {ElLoadingComponent} from 'element-ui/types/loading';

declare module 'axios' {
    // axios 配置对象中添加自定义属性
    export interface AxiosRequestConfig {
        extraInfo?: {
            // 取消全局错误提示
            noErrorHint?: boolean;
            // 取消全局 Loading
            noGlobalLoading?: boolean;
        };
    }

    // 定制业务相关的网络请求响应格式，T 是具体的接口返回类型数据
    export interface CustomSuccessData<T> {
        code: number;
        msg?: string;
        data?: T;
        [keys: string]: any;
    }
}

// Vue 原型上添加的东西，需要在此定义
declare module 'vue/types/vue' {
    interface Vue {
        $fullLoading(): ElLoadingComponent;
    }
}

// 添加全局属性
declare global {
    interface Window {
        BMap: any;
        BMapGL: any;
    }

    interface WsResponse<T> {
        ext: {type: number; clear?: any};
        data: T;
    }
}
