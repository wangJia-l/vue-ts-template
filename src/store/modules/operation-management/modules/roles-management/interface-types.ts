import {MutationTree, GetterTree, ActionTree, ActionContext} from 'vuex';
import {RootState} from '@/store/root-store/interface-types';
import {
    FETCH_ROLES_MANAGEMEN_LIST_ACTION,
    ADD_ROLES_MANAGEMEN_LIST_ACTION,
    UPDATE_ROLES_MANAGEMEN_LIST_ACTION,
    DELETE_ROLES_MANAGEMEN_LIST_ACTION,
    FETCH_ROLES_MANAGEMEN_AUTH_LIST_ACTION,
    UPDATE_ROLES_MANAGEMEN_AUTH_LIST_ACTION,
    FETCH_MY_INFO_AUTH_LIST_ACTION
} from './store-types';

// 角色管理列表请求
export interface FetchTableListParams {
    pageNo: number;
    pageSize: number;
    roleName: string;
}
// 角色列表新增数据参数
export interface AddListParams {
    roleName: string;
    roleInfo: string;
}
// 角色管理列表响应具体数据
export interface FetchRolesManagementDataResponseItem {
    id: number;
    roleName: string;
    roleInfo: string;
    createUserName?: string;
    dbCreateTime?: string;
}
// 角色管理列表响应
export interface FetchRolesManagementDataResponse {
    items: any;
    total: any;
}
export interface FetchRolesManagementDataResponseProcessed {
    total: number;
    items: FetchRolesManagementDataResponseItem[];
}
// 角色列表新增、编辑，状态数据参数
export interface UpdateListDataResponseItem {
    code: string;
    msg: string;
    data: string;
    status: number;
    responseTime: string;
}

// 角色权限资源
export interface AuthResourceResponseItem {
    resourceId: number;
    resourceName: string;
    resourceInfo?: string;
    resourceUrl: string;
    resourceCode?: string;
    resourceType?: number;
    parentId: number;
    appName?: string;
}

// 角色权限资源列表响应
export interface FetchAuthResourceDataResponse {
    resourceIds: AuthResourceResponseItem[];
    hasResourceIds: AuthResourceResponseItem[];
}

// 角色权限资源列表响应
export interface UpdateAuthResourceParams {
    roleId: number;
    resourceIds: number[];
    resourceHalfIds: number[];
}

// 查看个人权限返回值
export interface FetchUserInfoAuthDataResponse {
    hasResources: any[];
    userInfo: {};
}

// State
export interface RolesManagementState {}

// Getter
export interface RolesManagementGetters extends GetterTree<RolesManagementState, RootState> {}

// Mutation
export interface RolesManagementMutations extends MutationTree<RolesManagementState> {}

// Action
export interface RolesManagementActions extends ActionTree<RolesManagementState, RootState> {
    [FETCH_ROLES_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<RolesManagementState, RootState>,
        payload: FetchTableListParams
    ): Promise<FetchRolesManagementDataResponseProcessed>;
    [ADD_ROLES_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<RolesManagementState, RootState>,
        payload: AddListParams
    ): Promise<boolean>;
    [UPDATE_ROLES_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<RolesManagementState, RootState>,
        payload: FetchRolesManagementDataResponseItem
    ): Promise<boolean>;
    [DELETE_ROLES_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<RolesManagementState, RootState>,
        payload: any[]
    ): Promise<number>;
    [FETCH_ROLES_MANAGEMEN_AUTH_LIST_ACTION](
        actionContext: ActionContext<RolesManagementState, RootState>,
        payload: any
    ): Promise<any>;
    [UPDATE_ROLES_MANAGEMEN_AUTH_LIST_ACTION](
        actionContext: ActionContext<RolesManagementState, RootState>,
        payload: UpdateAuthResourceParams
    ): Promise<boolean>;
    [FETCH_MY_INFO_AUTH_LIST_ACTION](
        actionContext: ActionContext<RolesManagementState, RootState>,
        payload: FetchUserInfoAuthDataResponse
    ): Promise<void>;
}
