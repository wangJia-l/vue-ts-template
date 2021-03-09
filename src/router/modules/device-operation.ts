import {lazyLoadHelper} from '@/utils';
import {RouteConfig} from 'vue-router';

export const deviceOperationRoutes: RouteConfig[] = [
    {
        path: 'menu1/menu2',
        component: lazyLoadHelper('device-operation/pages/system-management/index')
    },
    {
        path: 'basic/customer',
        component: lazyLoadHelper('device-operation/pages/basic-management/customer/index')
    },
    {
        path: 'system/functions',
        component: lazyLoadHelper('device-operation/pages/system-management/functions/index')
    },
    {
        path: 'system/roles',
        component: lazyLoadHelper('device-operation/pages/system-management/roles/index')
    },
    {
        path: 'system/authority',
        component: lazyLoadHelper('device-operation/pages/system-management/authority/index')
    }
];
