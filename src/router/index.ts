import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import {CommonUrls, lazyLoadHelper} from '@/utils';
import {beforeEachCallback, beforeResolveCallback, afterEachCallback} from '@/router/router-guards/index';

import {deviceOperationRoutes} from '@/router/modules/device-operation.ts';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: CommonUrls.Root,
        redirect: '/login'
    },
    {
        path: CommonUrls.Login,
        component: lazyLoadHelper('common/login')
    },
    {
        // 设备运维管理
        path: CommonUrls.DeviceOperation,
        component: lazyLoadHelper('device-operation/index'),
        children: [
            ...deviceOperationRoutes,
            {
                path: '*',
                component: lazyLoadHelper('common/404')
            }
        ]
    },
    {
        path: CommonUrls.NotFound,
        component: lazyLoadHelper('common/404')
    },
    {
        path: '*',
        redirect: CommonUrls.NotFound
    }
];

const router = new VueRouter({routes});

// 全局前置导航
router.beforeEach(beforeEachCallback);

// 全局解析前置
router.beforeResolve(beforeResolveCallback);

// 全局后置
router.beforeResolve(afterEachCallback);

export default router;
