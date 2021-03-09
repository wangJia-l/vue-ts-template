<template>
    <div class="function-management-table-data-container">
        <div class="fun-table-header">
            <span class="title">
                <i v-show="tableName" class="el-icon-edit"></i>
                {{ tableName || '' }}
            </span>
            <el-button
                icon="el-icon-plus"
                size="small"
                :disabled="hasResource"
                @click="insertDataHandler(0, tableData)"
            >
                新增
            </el-button>
        </div>
        <el-table
            :data="tableDataItems"
            class="custom-data-table"
            header-cell-class-name="th-cell"
            cell-class-name="td-cell"
        >
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
                        <el-button type="text" size="small" @click="insertDataHandler(1, scope.row)">
                            编辑
                        </el-button>
                        <el-button type="text" size="small" @click="removeResource(scope.row)">删除</el-button>
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
import {FetchResourceManagementDataResponseItem} from '@/store/modules/operation-management/modules/resource-management/interface-types';
@Component
export default class FunctionManagementTableData extends Vue {
    @Prop({type: Object, required: true}) tableData!: {};
    tableName = '';
    tableDataItems: any = [];

    readonly tableColumns: TableColumnCustom[] = [
        {prop: 'resourceName', label: '功能名称', minWidth: 160},
        {prop: 'resourceModule', label: '所属模块', minWidth: 160},
        {prop: 'resourceUrl', label: 'URL', minWidth: 200},
        {prop: 'handle', label: '操作', width: 170, fixed: 'right'}
    ];
    // 表格内容格式化
    formatters(formatter: Formatter, row: Row, column: TableColumnCustom) {
        return formatterElCellContent(formatter, row, column);
    }

    get hasResource() {
        return this.tableName === '' || this.tableName === undefined;
    }

    @Watch('tableData', {deep: true})
    watchTableData(val: any) {
        this.tableName = val.resourceName;
        this.tableDataItems = val.children ? val.children : [];
        this.tableDataItems.forEach((item: any) => {
            item.resourceModule = val.resourceName;
        });
    }
    // 新增0 编辑1
    insertDataHandler(isEditMode: number, data?: FetchResourceManagementDataResponseItem) {
        this.$emit('insert-data-handler', isEditMode, data);
    }

    // 删除
    @Emit('remove-resource')
    removeResource(data: FetchResourceManagementDataResponseItem) {
        return data;
    }
}
</script>
<style lang="less" scoped>
.function-management-table-data-container {
    flex: 1;
    overflow: auto !important;
    background-color: #fff;
    padding-top: 10px;
    padding-bottom: 10px;
    height: 100%;

    .fun-table-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;

        .title {
            font-weight: bold;
        }
    }
}
</style>
