<template>
    <div class="authority-management-table-data-container">
        <el-table
            :data="tableData"
            class="custom-data-table"
            header-cell-class-name="th-cell"
            cell-class-name="td-cell"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="35" fixed="left" :selectable="checkboxT"></el-table-column>
            <el-table-column type="index" label="序号" width="50" fixed="left"></el-table-column>
            <el-table-column
                v-for="column in tableColumns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :fixed="column.fixed"
                :width="column.width"
                :min-width="column.minWidth || 100"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <!--表格列：操作-->
                    <template v-if="column.prop === 'handle'">
                        <el-button type="text" size="small" @click="editData(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="text" size="small" @click="queryPassWord(scope.row)">重置密码</el-button>
                        <el-button type="text" size="small" @click="operationLog(scope.row)">操作日志</el-button>
                    </template>
                    <template v-else>
                        <span>{{ formatters(column.formatter, scope.row, column) }}</span>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Ref, Prop, Emit, Watch} from 'vue-property-decorator';
import {ElForm} from 'element-ui/types/form';
import {TableColumnCustom, Formatter, Row} from '@/utils/element-helper/types';
import {formatterElCellContent, clearValidate} from '@/utils';
import {
    FetchTableListParams,
    FetchAuthorityManagementDataResponseProcessed,
    FetchAuthorityManagementDataResponseItem
} from '@/store/modules/operation-management/modules/authority-management/interface-types';
import {TYPE_STATUS, USER_ROLE} from '@/config/operation-management/modules/system-management/config';
@Component
export default class AuthorityManagementTableData extends Vue {
    @Prop({type: Array, required: true}) tableData!: FetchAuthorityManagementDataResponseItem[];
    @Prop({type: Array, default: () => []}) stateArr!: any[];
    readonly tableColumns: TableColumnCustom[] = [
        {prop: 'realname', label: '姓名', minWidth: 160},
        {prop: 'username', label: '用户名', minWidth: 160},
        {prop: 'email', label: '邮箱', minWidth: 160},
        {prop: 'phoneNumber', label: '手机号', minWidth: 160},
        {
            prop: 'role',
            label: '角色',
            minWidth: 160
        },
        {
            prop: 'status',
            label: '用户状态',
            minWidth: 160,
            formatter: (row) => TYPE_STATUS[row.status]
        },
        {prop: 'handle', label: '操作', width: 170, fixed: 'right'}
    ];
    // 表格内容格式化
    formatters(formatter: Formatter, row: Row, column: TableColumnCustom) {
        return formatterElCellContent(formatter, row, column);
    }
    //编辑 显示出数据
    editData(row: Row) {
        this.$emit('insert-handler', 1, row);
    }
    //修改密码
    queryPassWord(row: Row) {
        this.$emit('insert-handler', 3, row);
    }
    // 获取选中的数据
    @Emit('update:state-arr')
    handleSelectionChange(list: Row[]) {
        return list;
    }
    //禁用超级管理员的序号点击
    checkboxT(row: Row) {
        if (row.role === 1) {
            return false;
        } else {
            return true;
        }
    }
    //操作日志
    operationLog(row: Row) {
        this.$emit('insert-handler', 2, row);
    }
}
</script>
<style lang="less">
.authority-management-table-data-container {
    flex: 1;
    .operation-management-data-container();
}
</style>
