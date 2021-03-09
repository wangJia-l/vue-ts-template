import {MenuConfig} from './types';

const menuConfigs: MenuConfig[] = [
    {
        path: '/menu1',
        icon: 'system',
        title: '测试菜单1级',
        children: [{path: '/menu2', title: '测试菜单2级'}]
    },
    {
        path: '/basic',
        icon: 'basic',
        title: '基础数据管理',
        children: [
            {path: '/customer', title: '客户管理'},
            {path: '/device-model', title: '设备型号管理（后续迭代）'}
        ]
    },
    {
        path: '/system',
        icon: 'system',
        title: '系统管理',
        children: [
            {path: '/authority', title: '用户管理'},
            {path: '/roles', title: '角色管理'},
            {path: '/functions', title: '功能管理'}
        ]
    }
];

export default menuConfigs;
