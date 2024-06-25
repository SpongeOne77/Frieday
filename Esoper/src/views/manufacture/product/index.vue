<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import {onMounted} from "vue";
import {addProduct, deleteProduct, editLine, editProduct, getProducts} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import ProductOperateDrawer from './modules/product-operate-drawer.vue';
import ProductSearch from './modules/product-search.vue';

const appStore = useAppStore();

const { columns, columnChecks, data, getData, loading, mobilePagination, searchParams, resetSearchParams } = useTable({
  immediate: false,
  apiFn: getProducts,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    productName: null,
    productCode: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'productName',
      title: $t('page.manufacture.product.productName'),
      align: 'center',
      width: 100
    },
    {
      key: 'productCode',
      title: $t('page.manufacture.product.productCode'),
      align: 'center',
      width: 100
    },
    {
      key: 'productText',
      title: $t('page.manufacture.product.productText'),
      align: 'center',
      width: 100
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);
  await deleteProduct(checkedRowKeys.value);
  await onBatchDeleted();
}

async function handleDelete(id: string) {
  // request
  console.log(id);
  await deleteProduct([id]);
  await onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}

const onSubmit = item => {
  console.log(item);
  if (operateType.value === 'add') {
    addProduct(item).then(() => {
      getData();
    });
  }
  if (operateType.value === 'edit') {
    editProduct(item).then(() => {
      getData();
    });
  }
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ProductSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard
      :title="$t('page.manufacture.product.title')"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <ProductOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="onSubmit"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
