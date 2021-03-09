<template>
    <div class="basic-information-container">
        <div class="form-item-title">
            <span class="icon"></span>
            基础信息
        </div>
        <div class="form-item-group">
            <el-form-item label="姓名" label-width="124px" class="insert-data-form-item" prop="realName">
                <el-input
                    :value="realName"
                    :disabled="isDisAbled"
                    class="form-item-inner"
                    placeholder="请输入"
                    clearable
                    size="small"
                    @input="bindRealName"
                />
            </el-form-item>
            <el-form-item label="邮箱" label-width="124px" class="insert-data-form-item" prop="email">
                <el-input
                    :value="email"
                    :disabled="isDisAbled"
                    class="form-item-inner"
                    placeholder="请输入"
                    clearable
                    size="small"
                    @input="bindEmail"
                />
            </el-form-item>
            <el-form-item label="账号" label-width="124px" class="insert-data-form-item" prop="userName">
                <el-input
                    :value="userName"
                    :disabled="isDisAbled"
                    class="form-item-inner"
                    placeholder="请输入"
                    clearable
                    size="small"
                    auto-complete="new-username"
                    @input="bindUsername"
                />
            </el-form-item>
            <el-form-item label="手机号" label-width="124px" class="insert-data-form-item" prop="phoneNumber">
                <el-input
                    :value="phoneNumber"
                    :disabled="isDisAbled"
                    class="form-item-inner"
                    placeholder="请输入"
                    clearable
                    size="small"
                    @input="bindPhoneNumber"
                />
            </el-form-item>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Emit, Watch} from 'vue-property-decorator';
// import {CLASSIFY_ROLE} from '@/config/operation-management/modules/system-management/config.ts';
@Component
export default class BasicInformation extends Vue {
    @Prop({type: String, default: ''}) realName!: '';
    @Prop({type: String, default: ''}) userName!: '';
    @Prop({type: String, default: ''}) email!: '';
    @Prop({type: String, default: ''}) phoneNumber!: '';
    // @Prop({type: Boolean, default: true}) isAbled!: boolean;
    @Prop({type: Number}) isEditMode!: number;

    get isDisAbled() {
        return !!this.isEditMode;
    }

    @Emit('update:realName')
    bindRealName(val: string) {
        return val;
    }
    @Emit('update:email')
    bindEmail(val: string) {
        return val;
    }
    @Emit('update:userName')
    bindUsername(val: string) {
        return val;
    }
    @Emit('update:phoneNumber')
    bindPhoneNumber(val: string) {
        return val;
    }
    // @Emit('update:isAbled')
    // bindIsAbled(val: boolean) {
    //     return val;
    // }
    @Emit('update:isEditMode')
    bindIsEditMode(val: boolean) {
        return val;
    }
}
</script>
<style lang="less" scoped>
.basic-information-container {
    .drawer-data-container();

    .form-item-group {
        .form-item-inner {
            margin-left: 14px;
        }

        .form-item-inner-role {
            margin-left: 29px;
        }

        /deep/.el-form-item__error {
            margin-left: 14px;
        }
    }
}
</style>
