import {
    FETCH_AUTHORITY_MANAGEMENT_LIST_URL,
    FETCH_AUTHORITY_MANAGEMEN_LIST_ACTION,
    ADD_AUTHORITY_MANAGEMENT_LIST_URL,
    ADD_AUTHORITY_MANAGEMEN_LIST_ACTION,
    UPDATE_AUTHORITY_MANAGEMENT_LIST_URL,
    UPDATE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    PASSWORD_AUTHORITY_MANAGEMENT_LIST_URL,
    PASSWORD_AUTHORITY_MANAGEMEN_LIST_ACTION,
    SYSLOG_AUTHORITY_MANAGEMENT_LIST_URL,
    SYSLOG_AUTHORITY_MANAGEMEN_LIST_ACTION,
    DELETE_AUTHORITY_MANAGEMENT_LIST_URL,
    DELETE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    ENABLE_AUTHORITY_MANAGEMENT_LIST_URL,
    ENABLE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    DISABLE_AUTHORITY_MANAGEMENT_LIST_URL,
    DISABLE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    FETCH_USER_ROLES_MANAGEMENT_LIST_URL,
    FETCH_USER_ROLES_MANAGEMEN_LIST_ACTION
} from './store-types';
import {
    AuthorityManagementState,
    AuthorityManagementGetters,
    AuthorityManagementMutations,
    AuthorityManagementActions,
    FetchAuthorityManagementDataResponse,
    FetchAuthorityManagementDataResponseItem,
    UpdateListDataResponseItem,
    SysLogListDataResponse,
    SysLogListDataResponseItem
} from './interface-types';
import {request, parseContent} from '@/utils';

const state: AuthorityManagementState = {};

const getters: AuthorityManagementGetters = {};

const mutations: AuthorityManagementMutations = {};

const actions: AuthorityManagementActions = {
    //获取用户列表数据
    async [FETCH_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.post<FetchAuthorityManagementDataResponse>(
            FETCH_AUTHORITY_MANAGEMENT_LIST_URL,
            payload
        );
        if (+code === 0 && data) {
            const {items = [], total} = data;
            const listProcessed = items.map((item: FetchAuthorityManagementDataResponseItem) => {
                return {
                    token: item.token,
                    id: item.id,
                    username: item.username,
                    email: item.email,
                    phoneNumber: item.phoneNumber,
                    role: item.roleList.map((item) => item.roleName).join('，'),
                    password: item.password,
                    realname: item.realName,
                    status: item.status,
                    dbCreateTime: item.dbCreateTime,
                    dbUpdateTime: item.dbUpdateTime
                };
            });
            return {
                total: total,
                list: listProcessed
            };
        } else {
            return {
                total: 0,
                list: []
            };
        }
    },
    //用户列表新增
    async [ADD_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<UpdateListDataResponseItem>(ADD_AUTHORITY_MANAGEMENT_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    //用户列表编辑
    async [UPDATE_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<UpdateListDataResponseItem>(UPDATE_AUTHORITY_MANAGEMENT_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    //用户列表修改密码
    async [PASSWORD_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<UpdateListDataResponseItem>(PASSWORD_AUTHORITY_MANAGEMENT_LIST_URL, payload, {
            extraInfo: {noGlobalLoading: true}
        });
        return +code === 0 ? true : false;
    },
    //用户列表禁用状态
    async [DISABLE_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<UpdateListDataResponseItem>(DISABLE_AUTHORITY_MANAGEMENT_LIST_URL, payload);
        return code;
    },
    //用户列表启用状态
    async [ENABLE_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code} = await request.post<UpdateListDataResponseItem>(ENABLE_AUTHORITY_MANAGEMENT_LIST_URL, payload);
        return code;
    },
    //用户列表操作日志(这里有问题，不支持分页器，我需要分页器相关的参数)
    async [SYSLOG_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.post<SysLogListDataResponse>(SYSLOG_AUTHORITY_MANAGEMENT_LIST_URL, payload);
        if (+code === 0 && data) {
            const {list = [], page} = data;
            const listProcessed = list.map((item: SysLogListDataResponseItem) => {
                return {
                    createDate: item.createDate,
                    endTime: item.endTime,
                    startTime: item.startTime,
                    id: item.id,
                    ip: item.ip,
                    method: item.method,
                    requestType: item.requestType,
                    url: item.url,
                    username: item.username,
                    content: item.content,
                    realname: item.realname,
                    moduleName: item.moduleName,
                    paramValue: item.paramValue
                };
            });
            return {
                total: page.total,
                list: listProcessed
            };
        } else {
            return {
                total: 0,
                list: []
            };
        }
    },
    async [DELETE_AUTHORITY_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.post<any>(DELETE_AUTHORITY_MANAGEMENT_LIST_URL, payload);
        return {code, data};
    },
    async [FETCH_USER_ROLES_MANAGEMEN_LIST_ACTION]({commit}, payload) {
        const {code, data} = await request.post<any>(FETCH_USER_ROLES_MANAGEMENT_LIST_URL, payload);
        if (+code === 0 && data) {
            const {allRoles, hasRoles} = data;
            // 返回选中的权限的id
            const checkedRoles = hasRoles.map((item: any) => item.id);
            return {allRoles, checkedRoles};
        } else {
            return {allRoles: [], checkedRoles: []};
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
