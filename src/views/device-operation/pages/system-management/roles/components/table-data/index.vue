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
                        <el-button type="text" size="small" @click="setRolesAuth(scope.row)">权限设置</el-button>
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
    @Prop({type: Array, required: true}) tableData!: [];
    @Prop({type: Array, default: () => []}) stateArr!: any[];
    readonly tableColumns: TableColumnCustom[] = [
        {prop: 'roleName', label: '角色', minWidth: 160},
        {prop: 'roleInfo', label: '描述', minWidth: 200},
        {prop: 'createUserName', label: '创建人', minWidth: 160},
        {prop: 'dbCreateTime', label: '创建时间', minWidth: 160},
        {prop: 'handle', label: '操作', width: 170, fixed: 'right'}
    ];
    // 表格内容格式化
    formatters(formatter: Formatter, row: Row, column: TableColumnCustom) {
        return formatterElCellContent(formatter, row, column);
    }
    // 编辑 显示出数据
    editData(row: Row) {
        this.$emit('insert-handler', 1, row);
    }
    // 角色权限设置
    setRolesAuth(row: Row) {
        this.$emit('insert-handler', 2, row);
    }
    // 获取选中的数据
    @Emit('update:state-arr')
    handleSelectionChange(list: Row[]) {
        return list;
    }
    // 禁用超级管理员的序号点击
    checkboxT(row: Row) {
        if (row.roleName === '超级管理员') {
            return false;
        } else {
            return true;
        }
    }
}
</script>
<style lang="less" scoped>
.authority-management-table-data-container {
    flex: 1;
    .operation-management-data-container();
}
</style>
