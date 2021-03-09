<template>
    <div class="title-container">
        <div class="click-operation-container">
            <h2 class="title">
                功能管理
            </h2>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
@Component
export default class ClickOperationContainer extends Vue {}
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
    }
}
</style>
