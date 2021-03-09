<template>
    <el-container class="operation-management-container">
        <el-aside width="240px">
            <div class="aside-logo-container">
                <img src="~@/assets/images/logo.png" />
                &nbsp;|&nbsp;设备运维管理
            </div>
            <div class="aside-menu-container">
                <aside-menu />
            </div>
        </el-aside>
        <el-container>
            <el-header><header-common></header-common></el-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import AsideMenu from '@/views/device-operation/components/aside-menu/index.vue';
import HeaderCommon from '@/views/common/header-common.vue';
@Component({
    components: {
        AsideMenu,
        HeaderCommon
    }
})
export default class OperationManagementIndex extends Vue {}
</script>

<style scoped lang="less">
.operation-management-container {
    height: 100%;

    .el-aside {
        background-color: #1a244d;
        text-align: center;

        .aside-logo-container {
            height: 112px;
            line-height: 112px;
            background: inherit;
            color: #f3f6ff;
            font-size: 13px;
            font-weight: bold;

            img {
                width: 78px;
                height: 25px;
                vertical-align: text-bottom;
            }
        }
    }

    .el-header {
        background: #1a244d;
        color: #424d55;
        height: 55px !important;
        padding: 0 32px 0 24px;
    }

    .el-main {
        background-color: #e9eef3;
        color: #333;
        padding: 0.2rem;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
}
</style>
