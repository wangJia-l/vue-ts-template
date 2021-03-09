import AuthorityManagementStore from '@/store/modules/operation-management/modules/authority-management/index';
import RolesManagementStore from '@/store/modules/operation-management/modules/roles-management/index';
import ResourceManagementStore from '@/store/modules/operation-management/modules/resource-management/index';

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        authorityManagement: AuthorityManagementStore,
        rolesManagement: RolesManagementStore,
        resourceManagement: ResourceManagementStore
    }
};
