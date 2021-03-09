<template>
    <div class="password-container">
        <div class="form-item-title">
            <span class="icon"></span>
            密码设置
        </div>
        <div class="form-item-group">
            <el-form-item label="初始密码" label-width="144px" class="insert-data-form-item" prop="passWord">
                <el-input
                    :value="passWord"
                    :disabled="isDisAbled"
                    class="form-item-inner"
                    placeholder="默认为手机号的后6位"
                    clearable
                    show-password
                    size="small"
                    auto-complete="new-password"
                    @input="bindNewPassWord"
                />
            </el-form-item>
            <!-- <el-form-item label="确认密码" class="insert-data-form-item" prop="confirmPassword">
                <el-input
                    :value="confirmPassword"
                    class="form-item-inner"
                    placeholder="请输入"
                    clearable
                    show-password
                    size="small"
                    @input="bindConfirmPassword"
                />
            </el-form-item> -->
        </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Emit, Watch} from 'vue-property-decorator';
@Component
export default class PasswordSet extends Vue {
    @Prop({type: String, default: ''}) passWord!: string;
    @Prop({type: String, default: ''}) phoneNumber!: '';
    @Prop({type: String, default: ''}) confirmPassword!: '';
    @Prop({type: Number}) isEditMode!: number;

    get isDisAbled() {
        return !!this.isEditMode;
    }
    // 用于避免子直接修改父组件的值造成的waring
    tempPassWord = this.passWord;

    @Watch('phoneNumber')
    initPassword(newVal: string) {
        // 新增用户时，密码默认为手机号后6位
        if (this.isEditMode === 0 && newVal.length >= 6) {
            this.tempPassWord = newVal.substring(newVal.length - 6);
            this.bindNewPassWord(this.tempPassWord);
        }
    }

    @Emit('update:passWord')
    bindNewPassWord(val: string) {
        return val;
    }
    @Emit('update:confirmPassword')
    bindConfirmPassword(val: string) {
        return val;
    }
}
</script>
<style lang="less" scoped>
.password-container {
    .drawer-data-container();

    .form-item-group {
        .form-item-inner {
            margin-left: 14px;
        }

        /deep/.el-form-item__error {
            margin-left: 14px;
        }
    }
}
</style>
