<template>
    <el-drawer
        :visible.sync="innerVisible"
        :modal-append-to-body="false"
        custom-class="authority-drawer-container"
        :before-close="handleClose"
        size="800px"
    >
        <div slot="title" class="title">{{ title }}</div>
        <el-form
            ref="insertDataForm"
            :key="innerVisible"
            class="insert-data-form"
            :model="formData"
            :rules="rules"
            label-width="140px"
        >
            <div class="form-item-title">
                <span class="icon"></span>
                基础信息
            </div>
            <div class="form-item-group">
                <el-form-item label="资源名称" class="insert-data-form-item" prop="resourceName">
                    <el-input
                        v-model="formData.resourceName"
                        class="form-item-inner"
                        placeholder="请输入"
                        size="small"
                        clearable
                        maxlength="20"
                    />
                </el-form-item>
                <el-form-item label="资源描述" class="insert-data-form-item" prop="resourceInfo">
                    <el-input
                        v-model="formData.resourceInfo"
                        class="form-item-inner"
                        placeholder="请输入"
                        size="small"
                        clearable
                        maxlength="200"
                    />
                </el-form-item>
                <el-form-item label="资源地址" class="insert-data-form-item" prop="resourceUrl">
                    <el-input
                        v-model="formData.resourceUrl"
                        class="form-item-inner"
                        placeholder="请输入"
                        size="small"
                        clearable
                        maxlength="200"
                    />
                </el-form-item>
                <el-form-item label="资源编码" class="insert-data-form-item" prop="resourceCode">
                    <el-input
                        v-model="formData.resourceCode"
                        class="form-item-inner"
                        placeholder="请输入"
                        size="small"
                        clearable
                        maxlength="200"
                    />
                </el-form-item>
                <el-form-item label="资源类型" class="insert-data-form-item" prop="resourceType">
                    <el-radio-group v-model="formData.resourceType">
                        <el-radio :label="0">页面</el-radio>
                        <el-radio :label="1">操作按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <template>
                <div class="deawer-btn-group">
                    <el-button type="primary" :loading="loading" :disabled="loading" size="small" @click="saveHandler">
                        {{ loading ? '提交中...' : '提 交' }}
                    </el-button>
                    <el-button size="small" @click="cancelHandler">取 消</el-button>
                </div>
            </template>
        </el-form>
    </el-drawer>
</template>
<script lang="ts">
import {Component, Vue, Prop, Emit, Watch, Ref, Mixins} from 'vue-property-decorator';
import DialogVisibleMixin from '@/mixins/dialog-visible-mixin';
import {ElForm} from 'element-ui/types/form';
import {functionsRules} from '@/config/operation-management/modules/system-management/config.ts';
import {clearValidate, resetElFrom, validateELForm, convertTreeData} from '@/utils';
import {FetchResourceManagementDataResponseItem} from '@/store/modules/operation-management/modules/resource-management/interface-types';
const MAKE_DEFAULT_FORM_DATA = (): FetchResourceManagementDataResponseItem => ({
    id: 0,
    parentId: 0,
    resourceName: '',
    resourceInfo: '',
    resourceUrl: '',
    resourceCode: '',
    resourceType: 0,
    appName: ''
});
import {namespace} from 'vuex-class';
const operationManagementResourceManagementStore = namespace('operationManagement/resourceManagement');
import {
    ADD_RESOURCE_MANAGEMEN_LIST_ACTION,
    UPDATE_RESOURCE_MANAGEMEN_LIST_ACTION
} from '@/store/modules/operation-management/modules/resource-management/store-types';
@Component({
    components: {}
})
export default class ResourceFormData extends Mixins(DialogVisibleMixin) {
    @Ref() readonly insertDataForm!: ElForm;
    @Prop({type: Object, default: {}}) insertedData!: FetchResourceManagementDataResponseItem;
    @Prop({type: Number, default: 0}) isEditMode!: number;
    @Prop({type: Function, default: function() {}}) featchTreeData!: Function;

    // 新增
    @operationManagementResourceManagementStore.Action(ADD_RESOURCE_MANAGEMEN_LIST_ACTION)
    addListAction!: (payload: FetchResourceManagementDataResponseItem) => Promise<boolean>;
    // 编辑
    @operationManagementResourceManagementStore.Action(UPDATE_RESOURCE_MANAGEMEN_LIST_ACTION)
    updateListAction!: (payload: FetchResourceManagementDataResponseItem) => Promise<boolean>;

    readonly DrawerTitle: {[propsName: number]: string} = {
        0: '新增子节点',
        1: '编辑',
        2: '添加系统根节点'
    };
    // 数据录入校验规则
    get rules() {
        return functionsRules;
    }
    // 抽屉的名称
    get title() {
        return this.DrawerTitle[this.isEditMode];
    }
    // 默认的表单字段
    formData: FetchResourceManagementDataResponseItem = MAKE_DEFAULT_FORM_DATA();
    loading: boolean = false;

    @Watch('insertedData', {deep: true})
    isEditModeChange(newVal: boolean) {
        this.formData = this.isEditMode !== 0 ? Object.assign({}, this.insertedData) : MAKE_DEFAULT_FORM_DATA();
    }

    //提交
    async saveHandler() {
        const isFormValid = await validateELForm(this.insertDataForm);
        if (!isFormValid) {
            return;
        }
        const addParams = {
            parentId: this.insertedData.parentId,
            resourceName: this.formData.resourceName,
            resourceInfo: this.formData.resourceInfo,
            resourceUrl: this.formData.resourceUrl,
            resourceCode: this.formData.resourceCode,
            resourceType: this.formData.resourceType,
            appName: this.formData.appName
        };
        const updateParams: FetchResourceManagementDataResponseItem = {
            id: this.formData.id,
            parentId: this.formData.parentId,
            resourceName: this.formData.resourceName,
            resourceInfo: this.formData.resourceInfo,
            resourceUrl: this.formData.resourceUrl,
            resourceCode: this.formData.resourceCode,
            resourceType: this.formData.resourceType,
            appName: this.formData.appName
        };
        const requestFn: any = {
            0: this.addListAction,
            1: this.updateListAction,
            2: this.addListAction
        };
        const requestParams: any = {
            0: addParams,
            1: updateParams,
            2: addParams
        };
        this.loading = true;
        const insertResult = await requestFn[this.isEditMode](requestParams[this.isEditMode]);
        if (insertResult) {
            this.loading = false;
            this.innerVisible = false;
            this.featchTreeData();
            this.$emit('tree-node-click-handler', {}); // 清空右侧table组件的内容
            this.$message({
                type: 'success',
                message: `成功!`,
                duration: 1000
            });
        } else {
            this.loading = false;
        }
    }
    //关闭抽屉
    handleClose(done: () => void) {
        this.$confirm('确认关闭？')
            .then(() => {
                done();
            })
            .catch(() => {});
    }
    //取消
    cancelHandler() {
        this.handleClose(() => {
            this.innerVisible = false;
        });
    }
}
</script>
<style lang="less" scoped>
.insert-data-form {
    overflow: auto !important;
    background-color: #fff;
    padding-top: 10px;
    padding-bottom: 10px;
    height: 100%;

    .authority-drawer-data-container();

    .drawer-data-container();

    .form-item-group {
        .form-item-inner {
            margin-left: 14px;
        }

        /deep/.el-form-item__error {
            margin-left: 14px;
        }

        .insert-data-form-item {
            margin-left: -42px;
        }
    }
}
</style>
