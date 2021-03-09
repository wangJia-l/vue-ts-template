import {
    FETCH_RESOURCE_MANAGEMENT_LIST_URL,
    FETCH_RESOURCE_MANAGEMEN_LIST_ACTION,
    ADD_RESOURCE_MANAGEMENT_LIST_URL,
    ADD_RESOURCE_MANAGEMEN_LIST_ACTION,
    UPDATE_RESOURCE_MANAGEMENT_LIST_URL,
    UPDATE_RESOURCE_MANAGEMEN_LIST_ACTION,
    DELETE_RESOURCE_MANAGEMENT_LIST_URL,
    DELETE_RESOURCE_MANAGEMEN_LIST_ACTION
} from './store-types';
import {
    ResourceManagementState,
    ResourceManagementGetters,
    ResourceManagementMutations,
    ResourceManagementActions,
    FetchResourceManagementDataResponseProcessed
} from './interface-types';
import {request, convertTreeData} from '@/utils';
const state: ResourceManagementState = {};

const getters: ResourceManagementGetters = {};

const mutations: ResourceManagementMutations = {};

const actions: ResourceManagementActions = {
    // 资源列表-查询
    async [FETCH_RESOURCE_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.post<FetchResourceManagementDataResponseProcessed>(
            FETCH_RESOURCE_MANAGEMENT_LIST_URL,
            payload
        );
        if (+code === 0 && data) {
            const {items} = data;
            const elTreeData = convertTreeData(items, {
                id: 'id',
                pid: 'parentId',
                children: 'children'
            });
            return elTreeData;
        } else {
            return [];
        }
    },
    // 资源列表-新增
    async [ADD_RESOURCE_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<any>(ADD_RESOURCE_MANAGEMENT_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    // 资源列表-编辑
    async [UPDATE_RESOURCE_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<any>(UPDATE_RESOURCE_MANAGEMENT_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    // 资源列表-删除
    async [DELETE_RESOURCE_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<any>(DELETE_RESOURCE_MANAGEMENT_LIST_URL, payload);
        return code;
    }
};
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
