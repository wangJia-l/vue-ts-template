import {
    FETCH_ROLES_MANAGEMENT_LIST_URL,
    FETCH_ROLES_MANAGEMEN_LIST_ACTION,
    ADD_ROLES_MANAGEMENT_LIST_URL,
    ADD_ROLES_MANAGEMEN_LIST_ACTION,
    UPDATE_ROLES_MANAGEMENT_LIST_URL,
    UPDATE_ROLES_MANAGEMEN_LIST_ACTION,
    DELETE_ROLES_MANAGEMENT_LIST_URL,
    DELETE_ROLES_MANAGEMEN_LIST_ACTION,
    FETCH_ROLES_MANAGEMENT_AUTH_LIST_URL,
    FETCH_ROLES_MANAGEMEN_AUTH_LIST_ACTION,
    UPDATE_ROLES_MANAGEMENT_AUTH_LIST_URL,
    UPDATE_ROLES_MANAGEMEN_AUTH_LIST_ACTION,
    FETCH_MY_INFO_AUTH_LIST_URL,
    FETCH_MY_INFO_AUTH_LIST_ACTION
} from './store-types';
import {
    RolesManagementState,
    RolesManagementGetters,
    RolesManagementMutations,
    RolesManagementActions,
    FetchRolesManagementDataResponseProcessed,
    FetchRolesManagementDataResponse,
    FetchRolesManagementDataResponseItem,
    UpdateListDataResponseItem,
    AuthResourceResponseItem,
    FetchAuthResourceDataResponse,
    FetchUserInfoAuthDataResponse
} from './interface-types';
import {request, convertTreeData} from '@/utils';
import store from '@/store/index';
import {ROOT_UPDATE_USER_INFO_MUTATION} from '@/store/root-store/store-types';

const state: RolesManagementState = {};

const getters: RolesManagementGetters = {};

const mutations: RolesManagementMutations = {};

const actions: RolesManagementActions = {
    // 角色列表-查询
    async [FETCH_ROLES_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.post<FetchRolesManagementDataResponse>(
            FETCH_ROLES_MANAGEMENT_LIST_URL,
            payload
        );
        if (+code === 0 && data) {
            const {items = [], total} = data;
            const listProcessed = items.map((item: FetchRolesManagementDataResponseItem) => {
                return {
                    id: item.id,
                    roleName: item.roleName,
                    roleInfo: item.roleInfo,
                    createUserName: item.createUserName,
                    dbCreateTime: item.dbCreateTime
                };
            });
            return {
                total: total,
                items: listProcessed
            };
        } else {
            return {
                total: 0,
                items: []
            };
        }
    },
    // 角色列表-新增
    async [ADD_ROLES_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<UpdateListDataResponseItem>(ADD_ROLES_MANAGEMENT_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    // 角色列表-编辑
    async [UPDATE_ROLES_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<UpdateListDataResponseItem>(UPDATE_ROLES_MANAGEMENT_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    // 角色列表-删除
    async [DELETE_ROLES_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<any>(DELETE_ROLES_MANAGEMENT_LIST_URL, payload);
        return code;
    },
    // 角色列表-权限设置-查看
    async [FETCH_ROLES_MANAGEMEN_AUTH_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.post<FetchAuthResourceDataResponse>(
            FETCH_ROLES_MANAGEMENT_AUTH_LIST_URL,
            payload,
            {
                extraInfo: {noGlobalLoading: true}
            }
        );
        if (+code === 0 && data) {
            const {resourceIds, hasResourceIds} = data;
            const elTreeData = convertTreeData(resourceIds, {
                id: 'id',
                pid: 'parentId',
                children: 'children'
            });
            // 返回选中的权限的id
            const checkedAuthIds = hasResourceIds.map((item: any) => item.id);
            return {elTreeData, checkedAuthIds};
        } else {
            return {elTreeData: [], checkedAuthIds: []};
        }
    },
    // 角色列表-权限设置-保存
    async [UPDATE_ROLES_MANAGEMEN_AUTH_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<any>(UPDATE_ROLES_MANAGEMENT_AUTH_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    // 查看个人权限
    async [FETCH_MY_INFO_AUTH_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.get<FetchUserInfoAuthDataResponse>(FETCH_MY_INFO_AUTH_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        if (+code === 0 && data) {
            const {hasResources, userInfo} = data;
            store.commit(ROOT_UPDATE_USER_INFO_MUTATION, {
                grantedResouse: hasResources
            });
        }
    }
};
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
