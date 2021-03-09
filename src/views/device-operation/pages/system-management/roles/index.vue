<template>
    <div class="roles-management-container">
        <!-- 头部按钮及查询 -->
        <title-container
            :state-arr="stateArr"
            @insert-data-handler="insertDataHandler"
            @handle-delete="handleDelete"
            @handle-query="handleQuery"
            @handle-reset="handleReset"
        />
        <!-- 表格 -->
        <role-management-table-data
            :table-data="tableData"
            :state-arr.sync="stateArr"
            @insert-handler="insertDataHandler"
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
        <!-- 抽屉 -->
        <insert-data-drawer
            :visible.sync="insertDrawerVisible"
            :inserted-data.sync="insertedData"
            :is-edit-mode="isEditMode"
            :featch-table-data="featchTableData"
        />
    </div>
</template>
<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {Row} from '@/utils/element-helper/types';
import TitleContainer from './components/title-container/index.vue';
import RoleManagementTableData from '@/views/device-operation/pages/system-management/roles/components/table-data/index.vue';
import InsertDataDrawer from './components/insert-drawer/index.vue';
import {
    FetchTableListParams,
    FetchRolesManagementDataResponseProcessed,
    FetchRolesManagementDataResponseItem
} from '@/store/modules/operation-management/modules/roles-management/interface-types';
import {
    FETCH_ROLES_MANAGEMEN_LIST_ACTION,
    DELETE_ROLES_MANAGEMEN_LIST_ACTION
} from '@/store/modules/operation-management/modules/roles-management/store-types';
const operationManagementRolesManagementStore = namespace('operationManagement/rolesManagement');
interface queryParams {
    roleName: string;
}
@Component({
    components: {TitleContainer, RoleManagementTableData, InsertDataDrawer}
})
export default class RolesManagementContainer extends Vue {
    //获取表格数据
    @operationManagementRolesManagementStore.Action(FETCH_ROLES_MANAGEMEN_LIST_ACTION) fetchTableListAction!: (
        payload: FetchTableListParams
    ) => Promise<FetchRolesManagementDataResponseProcessed>;
    //删除
    @operationManagementRolesManagementStore.Action(DELETE_ROLES_MANAGEMEN_LIST_ACTION)
    deleteTableDataAction!: (payload: number[]) => Promise<any>;

    // 查询的挂载信息
    pageInfo = {
        total: 0,
        pageSize: 10,
        currentPage: 1
    };
    queryForm: queryParams = {
        roleName: ''
    };
    // 表格数据
    tableData: FetchRolesManagementDataResponseItem[] = [];
    // 模式：新增:0 编辑:1 权限设置:2
    isEditMode: number = 1;
    // 当编辑、修改密码模式 需要携带数据
    insertedData = {};
    // 编辑、新增、修改密码、操作日志的抽屉是否显示
    insertDrawerVisible: boolean = false;
    // 删除/启用/禁用需要的Id和status
    stateArr: FetchRolesManagementDataResponseItem[] = [];

    // 获取列表数据
    async featchTableData() {
        let params: FetchTableListParams = {
            pageNo: this.pageInfo.currentPage,
            pageSize: this.pageInfo.pageSize,
            roleName: this.queryForm.roleName
        };
        const {items, total} = await this.fetchTableListAction(params);
        this.pageInfo.total = total;
        this.tableData = items;
    }
    // 改变每页显示的条目数
    handleSizeChange(size: number) {
        this.pageInfo.pageSize = size;
        this.featchTableData();
    }
    // 改变页码
    handleCurrentChange(currentPage: number) {
        this.pageInfo.currentPage = currentPage;
        this.featchTableData();
    }
    //新增0、table表格中的编辑1、权限设置2
    insertDataHandler(isEditMode = 0, row?: Row) {
        if ((isEditMode === 1 || isEditMode === 2) && row) {
            // eslint-disable-next-line camelcase
            const {id, roleName, roleInfo, createUser, createTime} = row;
            this.insertedData = {
                id: id,
                roleName: roleName,
                roleInfo: roleInfo,
                createUser: createUser,
                createTime: createTime
            };
        } else {
            // 新增
            this.insertedData = {};
        }
        this.isEditMode = isEditMode;
        this.insertDrawerVisible = true;
    }
    //删除 操作方法
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
                    const code = await requestFn(params);
                    if (+code === 0) {
                        this.$message.success(`${operation}成功`);
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

    mounted() {
        // 获取角色列表数据
        this.featchTableData();
    }
}
</script>
