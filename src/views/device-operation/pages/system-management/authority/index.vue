<template>
    <div class="system-management-container">
        <!-- 头部按钮及查询 -->
        <title-container
            :state-arr="stateArr"
            @insert-data-handler="insertDataHandler"
            @handle-delete="handleDelete"
            @handle-state="handleState"
            @handle-query="handleQuery"
            @handle-reset="handleReset"
        />
        <!-- 表格 -->
        <authority-management-table-data
            :table-data="tableData"
            :state-arr.sync="stateArr"
            @insert-handler="insertDataHandler"
        />
        <!-- 抽屉 -->
        <insert-data-drawer
            :visible.sync="insertDrawerVisible"
            :inserted-data.sync="insertedData"
            :is-edit-mode="isEditMode"
            :featch-table-data="featchTableData"
        />
        <!-- 分页工具 -->
        <robo-pagination
            class="authority-management-robo-pagination"
            :current-page="pageInfo.currentPage"
            :page-size="pageInfo.pageSize"
            :total="pageInfo.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>
<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {Row} from '@/utils/element-helper/types';
import AuthorityManagementTableData from '@/views/device-operation/pages/system-management/authority/components/table-data/index.vue';
import {
    FETCH_AUTHORITY_MANAGEMEN_LIST_ACTION,
    ENABLE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    DISABLE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    DELETE_AUTHORITY_MANAGEMEN_LIST_ACTION
} from '@/store/modules/operation-management/modules/authority-management/store-types';
import {
    FetchTableListParams,
    FetchAuthorityManagementDataResponseProcessed,
    FetchAuthorityManagementDataResponseItem,
    StopStateListParams
} from '@/store/modules/operation-management/modules/authority-management/interface-types';
import InsertDataDrawer from './components/insert-drawer/index.vue';
import TitleContainer from './components/title-container/index.vue';
import {queryParams} from '@/views/device-operation/pages/system-management/authority/type.ts';
const operationManagementAuthorityManagementStore = namespace('operationManagement/authorityManagement');
@Component({
    components: {
        AuthorityManagementTableData,
        InsertDataDrawer,
        TitleContainer
    }
})
export default class AuthorityManagementContainer extends Vue {
    //获取表格数据
    @operationManagementAuthorityManagementStore.Action(FETCH_AUTHORITY_MANAGEMEN_LIST_ACTION) fetchTableListAction!: (
        payload: FetchTableListParams
    ) => Promise<FetchAuthorityManagementDataResponseProcessed>;
    //启用
    @operationManagementAuthorityManagementStore.Action(ENABLE_AUTHORITY_MANAGEMEN_LIST_ACTION)
    enableListAction!: (payload: StopStateListParams[]) => Promise<any>;
    //禁用
    @operationManagementAuthorityManagementStore.Action(DISABLE_AUTHORITY_MANAGEMEN_LIST_ACTION)
    disableListAction!: (payload: StopStateListParams[]) => Promise<any>;
    //删除
    @operationManagementAuthorityManagementStore.Action(DELETE_AUTHORITY_MANAGEMEN_LIST_ACTION)
    deleteTableDataAction!: (payload: number[]) => Promise<any>;
    tableData: FetchAuthorityManagementDataResponseItem[] = [];
    queryForm: queryParams = {
        userName: '',
        eventState: ''
    };
    mounted() {
        this.featchTableData();
    }
    // 获取列表数据
    async featchTableData() {
        let params: FetchTableListParams = {
            pageNo: this.pageInfo.currentPage,
            pageSize: this.pageInfo.pageSize,
            username: this.queryForm.userName,
            status: this.queryForm.eventState
        };
        const {list, total} = await this.fetchTableListAction(params);
        this.pageInfo.total = total;
        this.tableData = list;
    }
    // 编辑、新增、修改密码、操作日志的抽屉是否显示
    insertDrawerVisible: boolean = false;

    // 当编辑、修改密码模式 需要携带数据
    insertedData = {};

    // 删除/启用/禁用需要的Id和status
    stateArr: FetchAuthorityManagementDataResponseItem[] = [];

    // 模式：新增 0 编辑 1 操作日志 2 修改密码 3
    isEditMode: number = 1;

    pageInfo = {
        total: 0,
        pageSize: 10,
        currentPage: 1
    };
    // 执行查询事件
    handleQuery(msg: queryParams) {
        this.queryForm = msg;
        this.pageInfo.pageSize = 10;
        this.pageInfo.currentPage = 1;
        //传的具体参数没有写，再等后端的接口文档
        this.featchTableData();
    }

    // 清除查询条件
    handleReset(msg: queryParams) {
        this.queryForm = msg;
        this.pageInfo.pageSize = 10;
        this.pageInfo.currentPage = 1;
        this.featchTableData();
    }
    //新增、table表格中的编辑 1、修改密码、操作日志功能
    insertDataHandler(isEditMode = 0, row?: Row) {
        if ((isEditMode === 1 || isEditMode === 3 || isEditMode === 2) && row) {
            // eslint-disable-next-line camelcase
            const {
                id,
                password,
                realname,
                role,
                selected,
                status,
                statusStr,
                token,
                username,
                email,
                phoneNumber,
                allRoles,
                checkedRoles
            } = row;
            this.insertedData = {
                id: id,
                isAbled: true,
                realName: realname,
                roleType: role,
                userName: username,
                passWord: isEditMode === 3 ? phoneNumber.substring(phoneNumber.length - 6) : '',
                confirmPassword: '',
                dateTimeRange: [],
                email: email,
                allRoles: allRoles,
                checkedRoles: checkedRoles,
                phoneNumber: phoneNumber
            };
        } else {
            this.insertedData = {};
        }
        this.isEditMode = isEditMode;
        this.insertDrawerVisible = true;
    }
    //删除、启用、禁用的操作方法
    statusRequestFn(dataArr: number[], requestFn: any, operation: string, msg?: string) {
        let params: any;
        params = {ids: dataArr};
        if (Array.isArray(dataArr) && dataArr.length > 0) {
            this.$confirm(`${msg}确认${operation}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    if (operation === '删除') {
                        const {code, data = 0} = await requestFn(params);
                        if (+code === 0) {
                            this.$message.success(`删除成功，成功删除${data || 0}条数据`);
                        }
                    } else {
                        const code = await requestFn(params);
                        if (+code === 0) {
                            this.$message.success(`${operation}成功`);
                        }
                    }

                    this.featchTableData();
                })
                .catch(() => {});
        } else {
            this.$message.warning(`请选择需要${operation}的数据`);
        }
    }
    //删除功能
    handleDelete(deleteArrId: []) {
        this.statusRequestFn(deleteArrId, this.deleteTableDataAction, '删除', '删除操作不可撤销，');
    }
    //启用/禁用 功能
    handleState(stateArrId: number[], status: number) {
        if (+status === 3) {
            this.statusRequestFn(stateArrId, this.disableListAction, '禁用', '');
        } else if (+status === 0) {
            this.statusRequestFn(stateArrId, this.enableListAction, '启用', '');
        }
    }
    handleSizeChange(size: number) {
        this.pageInfo.pageSize = size;
        this.featchTableData();
    }

    handleCurrentChange(currentPage: number) {
        this.pageInfo.currentPage = currentPage;
        this.featchTableData();
    }
}
</script>
