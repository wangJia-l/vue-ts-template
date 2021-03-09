import {MutationTree, GetterTree, ActionTree, ActionContext} from 'vuex';
import {RootState} from '@/store/root-store/interface-types';
import {
    FETCH_RESOURCE_MANAGEMEN_LIST_ACTION,
    ADD_RESOURCE_MANAGEMEN_LIST_ACTION,
    UPDATE_RESOURCE_MANAGEMEN_LIST_ACTION,
    DELETE_RESOURCE_MANAGEMEN_LIST_ACTION
} from './store-types';

export interface FetchResourceManagementDataResponseItem {
    id: number;
    parentId: number;
    resourceName: string;
    resourceInfo?: string;
    resourceUrl?: string;
    resourceCode?: string;
    resourceType?: number;
    appName?: string;
}

export interface FetchResourceManagementDataResponseProcessed {
    items: FetchResourceManagementDataResponseItem[];
}

// State
export interface ResourceManagementState {}

// Getter
export interface ResourceManagementGetters extends GetterTree<ResourceManagementState, RootState> {}

// Mutation
export interface ResourceManagementMutations extends MutationTree<ResourceManagementState> {}

// Action
export interface ResourceManagementActions extends ActionTree<ResourceManagementState, RootState> {
    [FETCH_RESOURCE_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<ResourceManagementState, RootState>,
        payload: any
    ): Promise<FetchResourceManagementDataResponseProcessed>;
    [ADD_RESOURCE_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<ResourceManagementState, RootState>,
        payload: any
    ): Promise<boolean>;
    [UPDATE_RESOURCE_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<ResourceManagementState, RootState>,
        payload: any
    ): Promise<boolean>;
    [DELETE_RESOURCE_MANAGEMEN_LIST_ACTION](
        actionContext: ActionContext<ResourceManagementState, RootState>,
        payload: {ids: number[]}
    ): Promise<number>;
}
