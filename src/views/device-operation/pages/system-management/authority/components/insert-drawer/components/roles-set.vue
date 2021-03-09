<template>
    <div class="role-container">
        <div class="form-item-title">
            <span class="icon"></span>
            角色设置
        </div>
        <div class="form-item-group">
            <el-form-item label="角色" label-width="124px" class="insert-data-form-item">
                <el-checkbox-group v-model="tempCheckedRoles" @change="bindNewCheckedRole">
                    <el-checkbox v-for="item in allRoles" :key="item.id" :label="item.id">
                        {{ item.roleName }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Emit, Watch} from 'vue-property-decorator';
@Component
export default class RolesSet extends Vue {
    @Prop({type: Array, default: () => []}) allRoles!: [];
    @Prop({type: Array, default: () => []}) checkedRoles!: [];

    tempCheckedRoles = this.checkedRoles;

    @Watch('checkedRoles')
    changeTempChecked() {
        // 用于避免子直接修改父组件的值造成的waring
        this.tempCheckedRoles = this.checkedRoles;
    }

    @Emit('update:checkedRoles')
    bindNewCheckedRole(val: []) {
        // this.$emit('update:checkedRoles', val);
        return val;
    }
}
</script>
<style lang="less" scoped>
.role-container {
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
