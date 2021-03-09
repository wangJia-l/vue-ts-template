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
            <!-- 新增 || 编辑 -->
            <template v-if="isEditMode === 0 || isEditMode === 1">
                <!-- 基础信息 -->
                <basic-information
                    :real-name.sync="formData.realName"
                    :email.sync="formData.email"
                    :user-name.sync="formData.userName"
                    :phone-number.sync="formData.phoneNumber"
                    :is-abled.sync="formData.isAbled"
                />
                <!-- 密码设置 -->
                <password-set
                    :pass-word.sync="formData.passWord"
                    :phone-number.sync="formData.phoneNumber"
                    :is-edit-mode.sync="isEditMode"
                />
                <!-- 角色设置 -->
                <roles-set :all-roles.sync="formData.allRoles" :checked-roles.sync="formData.checkedRoles" />
            </template>
            <!-- 重置密码 -->
            <template v-if="isEditMode === 3">
                <basic-information
                    :real-name.sync="formData.realName"
                    :email.sync="formData.email"
                    :user-name.sync="formData.userName"
                    :phone-number.sync="formData.phoneNumber"
                    :is-abled.sync="formData.isAbled"
                    :is-edit-mode.sync="isEditMode"
                />
                <password-set :pass-word.sync="formData.passWord" :phone-number.sync="formData.phoneNumber" />
            </template>
            <!-- 日志 -->
            <template v-if="isEditMode === 2">
                <!-- 操作日志 -->
                <edit-log
                    :date-time-range.sync="formData.dateTimeRange"
                    :sys-log-table-data="sysLogTableData"
                    :page-size="editLogPageInfo.pageSize"
                    :page-no="editLogPageInfo.pageNo"
                    :total="editLogPageInfo.total"
                    class="edit-log-container"
                    @edit-log-handel-query="handelQuery"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </template>
        </el-form>
        <template v-if="isEditMode !== 2">
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
import {clearValidate, resetElFrom, validateELForm, formatTimeHelper, getSubDays} from '@/utils';
import {ElForm} from 'element-ui/types/form';
import PasswordSet from './components/password-set.vue';
import RolesSet from './components/roles-set.vue';
import BasicInformation from './components/basic-information.vue';
import EditLog from './components/edit-log.vue';
import {
    authorityRules,
    editModeObj,
    validatorObj
} from '@/config/operation-management/modules/system-management/config.ts';
import {InsertedData} from '@/store/modules/operation-management/modules/authority-management/interface-types.ts';
import {namespace} from 'vuex-class';
import {
    FETCH_AUTHORITY_MANAGEMEN_LIST_ACTION,
    ADD_AUTHORITY_MANAGEMEN_LIST_ACTION,
    UPDATE_AUTHORITY_MANAGEMEN_LIST_ACTION,
    PASSWORD_AUTHORITY_MANAGEMEN_LIST_ACTION,
    SYSLOG_AUTHORITY_MANAGEMEN_LIST_ACTION,
    FETCH_USER_ROLES_MANAGEMEN_LIST_ACTION
} from '@/store/modules/operation-management/modules/authority-management/store-types';
import {
    FetchTableListParams,
    AddListParams,
    UpdateListParams,
    PassWordListParams,
    SysLogListParams,
    SysLogListDataResponseProcessed,
    SysLogListDataResponseItem,
    FetchUserRolesManagementDataResponseProcessed,
    resetPasswordItem
} from '@/store/modules/operation-management/modules/authority-management/interface-types';
import {FETCH_MY_INFO_AUTH_LIST_ACTION} from '@/store/modules/operation-management/modules/roles-management/store-types';
import AuthorityManagementTableData from '@/views/device-operation/pages/system-management/authority/components/table-data/index.vue';
const operationManagementAuthorityManagementStore = namespace('operationManagement/authorityManagement');
const operationManagementRolesManagementStore = namespace('operationManagement/rolesManagement');
const crypto = require('crypto');

const MAKE_DEFAULT_FORM_DATA = (): InsertedData => ({
    id: '',
    isAbled: true,
    realName: '',
    roleType: 0,
    userName: '',
    passWord: '',
    confirmPassword: '',
    dateTimeRange: [],
    allRoles: [],
    checkedRoles: [],
    email: '',
    phoneNumber: ''
});
@Component({
    components: {
        PasswordSet,
        BasicInformation,
        EditLog,
        RolesSet
    }
})
export default class InsertDataDrawer extends Mixins(DialogVisibleMixin) {
    @Ref() readonly insertDataForm!: ElForm;
    @Prop({type: Boolean, default: false}) visible!: boolean;
    @Prop({type: Object, default: {}}) insertedData!: InsertedData;
    @Prop({type: Number, default: 0}) isEditMode!: number;
    @Prop({type: Function, default: function() {}}) featchTableData!: Function;
    //新增
    @operationManagementAuthorityManagementStore.Action(ADD_AUTHORITY_MANAGEMEN_LIST_ACTION)
    addListAction!: (payload: UpdateListParams) => Promise<boolean>;
    //编辑
    @operationManagementAuthorityManagementStore.Action(UPDATE_AUTHORITY_MANAGEMEN_LIST_ACTION) updateListAction!: (
        payload: UpdateListParams
    ) => Promise<boolean>;
    //重置密码
    @operationManagementAuthorityManagementStore.Action(PASSWORD_AUTHORITY_MANAGEMEN_LIST_ACTION) passWordListAction!: (
        payload: resetPasswordItem
    ) => Promise<boolean>;
    //操作日志
    @operationManagementAuthorityManagementStore.Action(SYSLOG_AUTHORITY_MANAGEMEN_LIST_ACTION) sysLogListAction!: (
        payload: SysLogListParams
    ) => Promise<SysLogListDataResponseProcessed>;
    // 获取角色checkbox列表
    @operationManagementAuthorityManagementStore.Action(FETCH_USER_ROLES_MANAGEMEN_LIST_ACTION)
    fetchUserRolesListAction!: (payload: any) => Promise<FetchUserRolesManagementDataResponseProcessed>;
    // 查看个人权限--角色管理
    @operationManagementRolesManagementStore.Action(FETCH_MY_INFO_AUTH_LIST_ACTION)
    fetchMyInfoAuthList!: (payload: any) => Promise<void>;

    formData: InsertedData = MAKE_DEFAULT_FORM_DATA();
    sysLogTableData: SysLogListDataResponseItem[] = [];
    loading: boolean = false;
    //操作日志分页器参数
    editLogPageInfo = {
        pageNo: 1,
        pageSize: 10,
        total: 0
    };
    get title() {
        return editModeObj[this.isEditMode];
    }
    @Watch('visible')
    async isEditModeChange(newVal: boolean) {
        if (newVal) {
            this.loading = false;
            this.formData = this.isEditMode !== 0 ? this.insertedData : MAKE_DEFAULT_FORM_DATA();
            const {allRoles, checkedRoles} = await this.fetchUserRolesListAction({userId: this.insertedData.id});
            this.formData.allRoles = allRoles;
            this.formData.checkedRoles = checkedRoles;
            if (this.isEditMode === 2) {
                // 操作日志默认情况下，为最近7天的数据
                this.formData.dateTimeRange = [
                    formatTimeHelper(getSubDays(new Date(), 7)),
                    formatTimeHelper(new Date())
                ];
                this.handelQuery();
            }
        } else {
            if (this.isEditMode === 2) {
                this.sysLogTableData = [];
                this.editLogPageInfo = {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                };
            }
            resetElFrom(this.insertDataForm);
            this.formData = MAKE_DEFAULT_FORM_DATA();
        }
    }
    // 数据录入校验规则
    get rules() {
        return authorityRules;
    }
    //操作日志中的查询功能
    async handelQuery() {
        const isFormValid = await validateELForm(this.insertDataForm);
        if (!isFormValid) {
            return;
        }
        let params: SysLogListParams = {
            username: this.formData.userName,
            startTime: this.formData.dateTimeRange && this.formData.dateTimeRange[0],
            endTime: this.formData.dateTimeRange && this.formData.dateTimeRange[1],
            pageNo: this.editLogPageInfo.pageNo,
            pageSize: this.editLogPageInfo.pageSize
        };
        if (params.startTime && params.endTime && params.username && params.pageNo && params.pageSize) {
            const {list, total} = await this.sysLogListAction(params);
            this.editLogPageInfo.total = total;
            this.sysLogTableData = list.map((item) => {
                return Object.assign({}, item);
            });
        }
    }
    //提交
    async saveHandler() {
        const isFormValid = await validateELForm(this.insertDataForm);
        if (!isFormValid) {
            return;
        }
        const addParams: AddListParams = {
            realName: this.formData.realName,
            email: this.formData.email,
            username: this.formData.userName,
            phoneNumber: this.formData.phoneNumber,
            password: crypto
                .createHash('md5')
                .update(this.formData.passWord)
                .digest('hex'),
            roleIds: this.formData.checkedRoles
        };
        const updateParams: UpdateListParams = {
            id: this.formData.id,
            realName: this.formData.realName,
            email: this.formData.email,
            username: this.formData.userName,
            phoneNumber: this.formData.phoneNumber,
            roleIds: this.formData.checkedRoles
        };
        const passWordParams: resetPasswordItem = {
            userId: this.formData.id,
            newPassword:
                this.formData.passWord === ''
                    ? crypto
                          .createHash('md5')
                          .update(this.formData.phoneNumber.substring(this.formData.phoneNumber.length - 6))
                          .digest('hex')
                    : crypto
                          .createHash('md5')
                          .update(this.formData.passWord)
                          .digest('hex')
        };
        const requestFn: any = {
            0: this.addListAction,
            1: this.updateListAction,
            3: this.passWordListAction
        };
        const requestParams: any = {
            0: addParams,
            1: updateParams,
            3: passWordParams
        };
        // (this.isEditMode === 3 && validatorObj.isSubmit)  (this.isEditMode === 0 && validatorObj.isSubmit)
        if (this.isEditMode === 3 || this.isEditMode === 0 || this.isEditMode === 1) {
            this.loading = true;
            const insertResult = await requestFn[this.isEditMode](requestParams[this.isEditMode]);
            if (insertResult) {
                this.loading = false;
                this.innerVisible = false;
                this.featchTableData();
                const operation = this.title.slice(0, 2);
                if (this.isEditMode === 1) {
                    // 重置localstorage里的个人权限，用于不同标签页面刷新查看更新后的个人权限
                    await this.fetchMyInfoAuthList({});
                }
                this.$message({
                    type: 'success',
                    message: `${operation}成功!`,
                    duration: 1000
                });
            } else {
                this.loading = false;
            }
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
    handleSizeChange(size: number) {
        this.editLogPageInfo.pageSize = size;
        this.handelQuery();
    }

    handleCurrentChange(currentPage: number) {
        this.editLogPageInfo.pageNo = currentPage;
        this.handelQuery();
    }
}
</script>
<style lang="less">
.authority-drawer-container {
    overflow: auto !important;
    .authority-drawer-data-container();
}
</style>
