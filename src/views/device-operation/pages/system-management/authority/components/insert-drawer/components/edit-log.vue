<template>
    <div class="edit-log-container">
        <div class="form-item-title">
            <span class="icon"></span>
            操作日志
        </div>
        <el-form-item label="起始时间" class="insert-data-form-item" prop="dateTimeRange">
            <el-date-picker
                :value="dateTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                clearable
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                :unlink-panels="true"
                @input="bindDateTimeRange"
            />
        </el-form-item>
        <div>
            <el-button type="primary" icon="el-icon-search" size="small" class="edit-log-btn" @click="handleQuery">
                查询
            </el-button>
        </div>
        <el-table
            :data="sysLogTableData"
            class="custom-data-table"
            header-cell-class-name="th-cell"
            cell-class-name="td-cell"
        >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column
                v-for="column in tableColumns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :min-width="column.minWidth || 100"
                show-overflow-tooltip
            ></el-table-column>
        </el-table>
        <!-- 分页工具 -->
        <robo-pagination
            class="authority-management-robo-pagination"
            :current-page="pageNo"
            :page-size="pageSize"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Emit, Watch} from 'vue-property-decorator';
import {TableColumnCustom, Formatter, Row} from '@/utils/element-helper/types';
import {SysLogListDataResponseItem} from '@/store/modules/operation-management/modules/authority-management/interface-types';

@Component
export default class EditLog extends Vue {
    @Prop({type: Array, default: () => []}) dateTimeRange!: [];
    @Prop({type: Array, required: true}) sysLogTableData!: SysLogListDataResponseItem[];
    @Prop({type: Number, required: true, default: 10}) pageSize!: number;
    @Prop({type: Number, required: true, default: 1}) pageNo!: number;
    @Prop({type: Number, required: true, default: 0}) total!: number;
    readonly tableColumns: TableColumnCustom[] = [
        {prop: 'username', label: '操作人', minWidth: 80},
        {prop: 'createDate', label: '时间', minWidth: 120},
        {prop: 'moduleName', label: '操作模块', minWidth: 100},
        // {prop: 'content', label: '操作内容', minWidth: 100},
        {prop: 'paramValue', label: '操作内容', minWidth: 100},
        {prop: 'ip', label: 'IP地址', minWidth: 140}
    ];
    @Emit('update:dateTimeRange')
    bindDateTimeRange(val: []) {
        return val;
    }
    @Emit('edit-log-handel-query')
    handleQuery() {}
    @Emit('current-change')
    handleCurrentChange() {}
    @Emit('size-change')
    handleSizeChange() {}
}
</script>
<style lang="less">
.edit-log-container {
    .drawer-edit-log-container();

    .insert-data-form-item {
        margin: 0 0 16px -42px;
    }

    .custom-data-table {
        .operation-management-data-container ();
    }

    .authority-management-robo-pagination {
        margin-right: 17px;
    }

    .edit-log-btn {
        margin: 4px 0 0 10px;
    }
}
</style>
