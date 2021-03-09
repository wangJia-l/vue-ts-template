import {MutationTree, GetterTree, ActionTree, ActionContext} from 'vuex';
import {RootState} from '@/store/root-store/interface-types';
import {
    FETCH_AUTHORITY_MANAGEMEN_LIST_ACTION,
    ADD_AUTHORITY_MANAGEMEN_LIST_ACTION,
    UPDATE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    PASSWORD_AUTHORITY_MANAGEMEN_LIST_ACTION,
    SYSLOG_AUTHORITY_MANAGEMEN_LIST_ACTION,
    DELETE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    ENABLE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    DISABLE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    FETCH_USER_ROLES_MANAGEMEN_LIST_ACTION
} from './store-types';

//用户管理列表请求
export interface FetchTableListParams {
    pageNo: number;
    pageSize: number;
    username: string;
    status: number | string;
}
//用户管理列表响应具体数据
export interface FetchAuthorityManagementDataResponseItem {
    token: null;
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    roleList: any[];
    password: string;
    realName: string;
    status: number;
    dbCreateTime: string;
    dbUpdateTime: string;
}
//用户管理列表-操作日志响应
export interface FetchAuthorityEditLogDataResponseItem {
    token: null;
    id: number;
    username: string;
    dataTime: string;
    ip: string;
    userContent: string[];
}
//用户管理列表响应
export interface FetchAuthorityManagementDataResponse {
    items: any;
    total: any;
}
export interface FetchAuthorityManagementDataResponseProcessed {
    total: number;
    list: FetchAuthorityManagementDataResponseItem[];
}
// 数据录入时完整表单项目
export interface InsertedData {
    id: number | string;
    isAbled: boolean;
    realName: string;
    roleType: number;
    userName: string;
    passWord: string;
    confirmPassword: string;
    dateTimeRange: string[];
    allRoles: any[];
    checkedRoles: any[];
    email: string;
    phoneNumber: string;
}
// 用户列表新增数据参数
export interface AddListParams {
    realName: string;
    email: string;
    username: string;
    phoneNumber: string;
    password: string;
    roleIds: number[];
}
// 用户列表编辑数据参数
export interface UpdateListParams {
    id: number | string;
    realName: string;
    email: string;
    username: string;
    phoneNumber: string;
    roleIds: number[];
}
export interface resetPasswordItem {
    userId: number | string;
    newPassword: string;
}
// 用户列表新增、编辑、修改密码，状态数据参数
export interface UpdateListDataResponseItem {
    code: string;
    msg: string;
    data: string;
    status: number;
    responseTime: string;
}
// 用户列表修改密码数据参数
export interface PassWordListParams {
    id: number | string;
    password: string;
    username: string;
    roleIds: number[];
}
// 用户列表 操作日志
export interface SysLogListParams {
    username: string;
    endTime: string;
    startTime: string;
    pageSize: number;
    pageNo: number;
}
// 用户列表 状态
export interface StopStateListParams {
    ids: any[];
    status: number | string;
}
// 用户列表 操作日志 响应具体数据
export interface SysLogListDataResponseItem {
    createDate: string;
    endTime: string;
    startTime: string;
    moduleName: string;
    id: number;
    ip: string;
    method: string;
    requestType: string;
    url: string;
    username: string;
    content: string;
    realname: string;
    paramValue: string;
}
export interface SysLogListDataResponse {
    list: any;
    page: any;
}
export interface SysLogListDataResponseProcessed {
    total: number;
    list: SysLogListDataResponseItem[];
}

// 获取用户-角色的chekbox列表
export interface FetchUserRolesManagementDataResponseProcessed {
    allRoles: any[];
    checkedRoles: any[];
}

// State
export interface AuthorityManagementState {}

// Getter
export interface AuthorityManagementGetters extends GetterTree<AuthorityManagementState, RootState> {}

// Mutation
export interface AuthorityManagementMutations extends MutationTree<AuthorityManagementState> {}

// Action
export interface AuthorityManagementActions extends ActionTree<AuthorityManagementState, RootState> {
    [FETCH_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: FetchTableListParams
    ): Promise<FetchAuthorityManagementDataResponseProcessed>;
    [ADD_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: AddListParams
    ): Promise<boolean>;
    [UPDATE_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: UpdateListParams
    ): Promise<boolean>;
    [PASSWORD_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: PassWordListParams
    ): Promise<boolean>;
    [ENABLE_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: StopStateListParams
    ): Promise<number>;
    [DISABLE_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: StopStateListParams
    ): Promise<number>;
    [SYSLOG_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: SysLogListParams
    ): Promise<SysLogListDataResponseProcessed>;
    [DELETE_AUTHORITY_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: any[]
    ): Promise<{code: number; data: number}>;
    [FETCH_USER_ROLES_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<AuthorityManagementState, RootState>,
        payload: any
    ): Promise<FetchUserRolesManagementDataResponseProcessed>;
}
