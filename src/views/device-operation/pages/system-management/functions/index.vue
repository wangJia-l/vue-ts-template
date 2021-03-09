<template>
    <div class="functions-management-container">
        <!-- 头部按钮及查询 -->
        <title-container />
        <!-- 主体内容 -->
        <div class="func-body-container">
            <!-- 功能树 -->
            <div class="auth-tree-container">
                <el-tree
                    ref="authTreeRef"
                    :data="authTreeData"
                    :props="defaultProps"
                    node-key="id"
                    :expand-on-click-node="false"
                    class="auth-tree"
                    @node-click="treeNodeClickHandler"
                >
                    <span slot-scope="{node, data}" class="custom-tree-node">
                        <span>{{ node.label }}</span>
                        <span class="right-btn">
                            <el-button type="text" size="mini" @click="() => insertDataHandler(1, data)">
                                编辑
                            </el-button>
                            <el-button type="text" size="mini" @click="() => removeResource(data)">
                                删除
                            </el-button>
                            <!-- 控制type为1的操作按钮不能再添加子节点 -->
                            <template v-if="data.resourceType !== 1">
                                <el-button type="text" size="mini" @click="() => insertDataHandler(0, data)">
                                    添加子节点
                                </el-button>
                            </template>
                        </span>
                    </span>
                </el-tree>
                <el-button type="text" size="mini" class="addSysRootNodeBtn" @click="() => insertDataHandler(2)">
                    添加系统根节点
                </el-button>
            </div>
            <!-- 表格 -->
            <function-management-table-data
                :table-data="tableData"
                @insert-data-handler="insertDataHandler"
                @remove-resource="removeResource"
            />
            <!-- 抽屉: 新增、编辑 表单 -->
            <resource-form-data
                :visible.sync="insertDrawerVisible"
                :inserted-data.sync="insertedData"
                :is-edit-mode="isEditMode"
                :featch-tree-data="featchTreeData"
                @tree-node-click-handler="treeNodeClickHandler"
            />
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Emit, Watch, Ref, Mixins} from 'vue-property-decorator';
import TitleContainer from './components/title-container/index.vue';
import ResourceFormData from './components/form-data/index.vue';
import FunctionManagementTableData from '@/views/device-operation/pages/system-management/functions/components/table-data/index.vue';
import {ElTree} from 'element-ui/types/tree';
import {namespace} from 'vuex-class';
const operationManagementResourceManagementStore = namespace('operationManagement/resourceManagement');
import {
    FETCH_RESOURCE_MANAGEMEN_LIST_ACTION,
    DELETE_RESOURCE_MANAGEMEN_LIST_ACTION
} from '@/store/modules/operation-management/modules/resource-management/store-types';
import {FetchResourceManagementDataResponseItem} from '@/store/modules/operation-management/modules/resource-management/interface-types';

@Component({
    components: {
        TitleContainer,
        ResourceFormData,
        FunctionManagementTableData
    }
})
export default class FunctionsManagementContainer extends Vue {
    @Ref() readonly authTreeRef!: ElTree<any, any>;
    // 获取资源树
    @operationManagementResourceManagementStore.Action(FETCH_RESOURCE_MANAGEMEN_LIST_ACTION)
    fetchResourceListAction!: (payload: {}) => Promise<any>;
    // 删除
    @operationManagementResourceManagementStore.Action(DELETE_RESOURCE_MANAGEMEN_LIST_ACTION)
    deleteListAction!: (payload: {ids: number[]}) => Promise<boolean>;
    // 编辑、新增 抽屉是否显示
    insertDrawerVisible: boolean = false;
    // 角色-权限设置 authTreeData
    authTreeData: any[] = [];
    // 权限资源数属性
    defaultProps = {
        children: 'children',
        label: 'resourceName'
    };
    // 模式：新增:0 编辑:1 添加系统根节点:2
    isEditMode: number = 1;
    // 编辑要携带的数据
    insertedData = {};
    // 表格数据
    tableData = {};

    // 获取左侧资源树
    async featchTreeData() {
        this.authTreeData = await this.fetchResourceListAction({});
    }
    // 新增：0，编辑：1， 添加系统根节点:2
    insertDataHandler(isEditMode: number, data?: FetchResourceManagementDataResponseItem) {
        if (isEditMode === 1 && data) {
            // eslint-disable-next-line camelcase
            const {id, parentId, resourceName, resourceInfo, resourceUrl, appName, resourceCode, resourceType} = data;
            this.insertedData = {
                id: id,
                parentId: parentId,
                resourceName: resourceName,
                resourceInfo: resourceInfo,
                resourceUrl: resourceUrl,
                appName: appName,
                resourceCode: resourceCode,
                resourceType: resourceType ? resourceType : 0
            };
        } else {
            if (isEditMode === 0 && data) {
                const {id} = data;
                // 新增子节点
                this.insertedData = {parentId: id};
            } else {
                // 添加系统根节点
                this.insertedData = {parentId: 0, resourceType: 0};
            }
        }
        this.isEditMode = isEditMode;
        this.insertDrawerVisible = true;
    }
    // 删除节点
    removeResource(data: FetchResourceManagementDataResponseItem) {
        this.$confirm(`删除操作不可撤销，确认删除`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                const code = await this.deleteListAction({ids: [data.id]});
                if (+code === 0) {
                    this.$message.success(`删除成功`);
                }
                this.featchTreeData();
                this.treeNodeClickHandler({});
            })
            .catch(() => {});
    }

    // 节点被点击的回调
    treeNodeClickHandler(currentData: any) {
        // 非功能按钮时
        if (currentData.resourceType !== 1) {
            this.tableData = currentData;
        }
    }

    mounted() {
        // 获取角色列表数据
        this.featchTreeData();
    }
}
</script>
<style lang="less" scoped>
.functions-management-container {
    height: 100%;
    overflow: hidden;

    .func-body-container {
        display: flex;
        height: calc(100% - 50px);

        .auth-tree-container {
            width: 32%;
            height: 100%;
            margin-right: 20px;
            background: #fff;
            overflow: auto;

            .auth-tree {
                padding: 10px;
            }

            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;

                .right-btn {
                    display: none;
                }

                &:hover .right-btn {
                    display: inline;
                }
            }

            .addSysRootNodeBtn {
                float: right;
                margin-top: 5px;
                margin-right: 37px;
            }
        }

        .func-form-container {
            flex: 1;
        }
    }
}
</style>
