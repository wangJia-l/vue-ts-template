<template>
    <el-drawer
        :visible.sync="innerVisible"
        :modal-append-to-body="false"
        custom-class="authority-drawer-container"
        :before-close="handleClose"
        size="800px"
        :featch-table-data="featchTableData"
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
            <template v-if="isEditMode === 0 || isEditMode === 1">
                <div class="form-item-title">
                    <span class="icon"></span>
                    基础信息
                </div>
                <div class="form-item-group">
                    <el-form-item label="角色名称" class="insert-data-form-item" prop="roleName">
                        <el-input
                            v-model="formData.roleName"
                            class="form-item-inner"
                            placeholder="请输入"
                            size="small"
                            clearable
                            maxlength="20"
                        />
                    </el-form-item>
                    <el-form-item label="角色描述" class="insert-data-form-item" prop="roleInfo">
                        <el-input
                            v-model="formData.roleInfo"
                            class="form-item-inner"
                            placeholder="请输入"
                            size="small"
                            clearable
                            maxlength="20"
                        />
                    </el-form-item>
                </div>
            </template>
        </el-form>
        <!-- 权限设置 -->
        <template v-if="isEditMode === 2">
            <div class="auth-tree-container">
                <el-tree
                    ref="authTreeRef"
                    :data="authTreeData"
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="checkedAuthId"
                    :props="defaultProps"
                    class="auth-tree"
                ></el-tree>
            </div>
        </template>
        <template>
            <div class="deawer-btn-group">
                <el-button type="primary" :loading="loading" :disabled="loading" size="small" @click="saveHandler">
                    {{ loading ? '提交中...' : '提 交' }}
                </el-button>
                <el-button size="small" @click="cancelHandler">取 消</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script lang="ts">
// 使用了 dialog-visible-mixin 控制 drawer 的可见性
import {Component, Prop, Emit, Watch, Ref, Mixins} from 'vue-property-decorator';
import DialogVisibleMixin from '@/mixins/dialog-visible-mixin';
import {clearValidate, resetElFrom, validateELForm, convertTreeData} from '@/utils';
import {ElForm} from 'element-ui/types/form';
import {rolesDrawerTitle, rolesRules} from '@/config/operation-management/modules/system-management/config.ts';
import {namespace} from 'vuex-class';
import {
    FETCH_ROLES_MANAGEMEN_LIST_ACTION,
    ADD_ROLES_MANAGEMEN_LIST_ACTION,
    UPDATE_ROLES_MANAGEMEN_LIST_ACTION,
    DELETE_ROLES_MANAGEMEN_LIST_ACTION,
    FETCH_ROLES_MANAGEMEN_AUTH_LIST_ACTION,
    UPDATE_ROLES_MANAGEMEN_AUTH_LIST_ACTION,
    FETCH_MY_INFO_AUTH_LIST_ACTION
} from '@/store/modules/operation-management/modules/roles-management/store-types';
import {
    FetchTableListParams,
    FetchRolesManagementDataResponseItem,
    AddListParams,
    UpdateAuthResourceParams
} from '@/store/modules/operation-management/modules/roles-management/interface-types';
import {ElTree} from 'element-ui/types/tree';
const operationManagementRolesManagementStore = namespace('operationManagement/rolesManagement');
const MAKE_DEFAULT_FORM_DATA = (): FetchRolesManagementDataResponseItem => ({
    id: 0,
    roleName: '',
    roleInfo: '',
    createUserName: '',
    dbCreateTime: ''
});

@Component({
    components: {}
})
export default class InsertDataDrawer extends Mixins(DialogVisibleMixin) {
    @Ref() readonly insertDataForm!: ElForm;
    @Ref() readonly authTreeRef!: ElTree<any, any>;
    @Prop({type: Boolean, default: false}) visible!: boolean;
    @Prop({type: Object, default: {}}) insertedData!: FetchRolesManagementDataResponseItem;
    @Prop({type: Number, default: 0}) isEditMode!: number;
    @Prop({type: Function, default: function() {}}) featchTableData!: Function;

    // 新增
    @operationManagementRolesManagementStore.Action(ADD_ROLES_MANAGEMEN_LIST_ACTION)
    addListAction!: (payload: AddListParams) => Promise<boolean>;
    // 编辑
    @operationManagementRolesManagementStore.Action(UPDATE_ROLES_MANAGEMEN_LIST_ACTION) updateListAction!: (
        payload: FetchRolesManagementDataResponseItem
    ) => Promise<boolean>;
    // 获取角色权限资源树
    @operationManagementRolesManagementStore.Action(FETCH_ROLES_MANAGEMEN_AUTH_LIST_ACTION)
    fetchAuthResourceListAction!: (payload: {roleId: number}) => Promise<any>;
    // 角色权限设置-编辑
    @operationManagementRolesManagementStore.Action(UPDATE_ROLES_MANAGEMEN_AUTH_LIST_ACTION)
    updateAuthResourceAction!: (payload: UpdateAuthResourceParams) => Promise<any>;
    // 查看个人权限
    @operationManagementRolesManagementStore.Action(FETCH_MY_INFO_AUTH_LIST_ACTION)
    fetchMyInfoAuthList!: (payload: any) => Promise<void>;

    // 角色-权限设置 authTreeData
    authTreeData: any[] = [];
    // 选择的资源的id
    checkedAuthId: number[] = [];
    // 权限资源数属性
    defaultProps = {
        children: 'children',
        label: 'resourceName'
    };
    // 抽屉的名称
    get title() {
        return rolesDrawerTitle[this.isEditMode];
    }
    // 数据录入校验规则
    get rules() {
        return rolesRules;
    }
    // 默认的表单字段
    formData: FetchRolesManagementDataResponseItem = MAKE_DEFAULT_FORM_DATA();
    loading: boolean = false;

    // 监听抽屉的隐显，进行初始化重置
    @Watch('visible')
    async isEditModeChange(newVal: boolean) {
        if (newVal) {
            this.loading = false;
            this.formData = this.isEditMode !== 0 ? Object.assign({}, this.insertedData) : MAKE_DEFAULT_FORM_DATA();
            // 权限设置：2，获取角色对应的权限
            if (this.isEditMode === 2) {
                const {elTreeData, checkedAuthIds} = await this.fetchAuthResourceListAction({roleId: this.formData.id});
                this.authTreeData = elTreeData;
                this.checkedAuthId = checkedAuthIds;
            }
        } else {
            resetElFrom(this.insertDataForm);
            this.formData = MAKE_DEFAULT_FORM_DATA();
        }
    }
    //提交
    async saveHandler() {
        const isFormValid = await validateELForm(this.insertDataForm);
        if (!isFormValid) {
            return;
        }
        const addParams: AddListParams = {
            roleName: this.formData.roleName,
            roleInfo: this.formData.roleInfo
        };
        const updateParams: FetchRolesManagementDataResponseItem = {
            id: this.formData.id,
            roleName: this.formData.roleName,
            roleInfo: this.formData.roleInfo,
            createUserName: this.formData.createUserName,
            dbCreateTime: this.formData.dbCreateTime
        };
        const updateAuthResourceParams: UpdateAuthResourceParams = {
            roleId: this.formData.id,
            resourceIds: this.isEditMode === 2 ? [...this.authTreeRef.getCheckedKeys()] : [],
            resourceHalfIds: this.isEditMode === 2 ? [...this.authTreeRef.getHalfCheckedKeys()] : []
        };
        const requestFn: any = {
            0: this.addListAction,
            1: this.updateListAction,
            2: this.updateAuthResourceAction
        };
        const requestParams: any = {
            0: addParams,
            1: updateParams,
            2: updateAuthResourceParams
        };
        this.loading = true;
        const insertResult = await requestFn[this.isEditMode](requestParams[this.isEditMode]);
        if (insertResult) {
            this.loading = false;
            this.innerVisible = false;
            this.featchTableData();
            const operation = this.title.slice(0, 2);
            // 重置localstorage里的个人权限，用于不同标签页面刷新查看更新后的个人权限
            await this.fetchMyInfoAuthList({});
            this.$message({
                type: 'success',
                message: `${operation}成功!`,
                duration: 1000
            });
        } else {
            this.loading = false;
        }
    }

    //取消
    cancelHandler() {
        this.handleClose(() => {
            this.innerVisible = false;
        });
    }
    //关闭抽屉
    handleClose(done: () => void) {
        this.$confirm('确认关闭？')
            .then(() => {
                done();
            })
            .catch(() => {});
    }
}
</script>
<style lang="less" scoped>
.authority-drawer-container {
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

    .auth-tree-container {
        .auth-tree {
            margin: 0 20px;
        }
    }
}
</style>
