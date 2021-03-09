<template>
    <div class="title-container">
        <div class="click-operation-container">
            <h2 class="title">
                角色管理
            </h2>
            <div class="btn-group">
                <el-button
                    v-allow="{name: '角色管理-新增'}"
                    icon="el-icon-plus"
                    size="small"
                    @click="insertDataHandler"
                >
                    新增
                </el-button>
                <el-button
                    v-allow="{name: '角色管理-删除'}"
                    icon="el-icon-delete"
                    size="small"
                    :disabled="disabledStatus"
                    @click="handleDelete"
                >
                    删除
                </el-button>
            </div>
        </div>
        <div class="query-container">
            <el-form ref="queryForm" :model="query" class="query-form">
                <el-form-item label="角色" class="query-form-item">
                    <el-input v-model.trim="query.roleName" size="small" placeholder="请输入" clearable></el-input>
                </el-form-item>
            </el-form>
            <div class="el-form-btn">
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-setting" size="small" @click="handleReset">清空</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Ref, Prop, Emit} from 'vue-property-decorator';
import {ElForm} from 'element-ui/types/form';
@Component
export default class ClickOperationContainer extends Vue {
    @Prop({type: Array, default: () => []}) stateArr!: any[];
    @Ref() readonly queryForm!: ElForm;
    query = {
        roleName: ''
    };
    //删除按钮状态
    get disabledStatus() {
        return !this.stateArr.length;
    }
    //新增
    @Emit('insert-data-handler')
    insertDataHandler() {
        return 0;
    }
    //删除
    @Emit('handle-delete')
    handleDelete() {
        return this.stateArr.map((item) => item.id);
    }
    //查询
    @Emit('handle-query')
    handleQuery() {
        return this.query;
    }
    //清空
    @Emit('handle-reset')
    handleReset() {
        this.query.roleName = '';
        return this.query;
    }
}
</script>
<style lang="less" scoped>
.title-container {
    .click-operation-container {
        height: 50px;

        .title {
            margin-bottom: 20px;
            text-align: left;
            float: left;
        }

        .btn-group {
            line-height: 0;
            text-align: left;
            float: right;
        }
    }

    .query-container {
        background: #fff;
        height: 51px;
        padding: 10px 25px;

        .query-form {
            float: left;

            .query-form-item {
                float: left;
                display: flex;
                margin: 0 20px 0 0;
            }
        }

        .el-form-btn {
            float: right;
        }
    }
}
</style>
