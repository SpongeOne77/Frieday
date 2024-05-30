<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { onMounted } from 'vue';
import { addLine, deleteLines, editLine, getLines, publishProduct } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import lineOperateDrawer from './modules/line-operate-drawer.vue';
import lineSearch from './modules/line-search.vue';

const appStore = useAppStore();

const { columns, columnChecks, data, getData, loading, mobilePagination, searchParams, resetSearchParams } = useTable({
  immediate: false,
  apiFn: getLines,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    lineName: null,
    lineCode: null
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
      key: 'lineName',
      title: $t('page.manufacture.line.lineName'),
      align: 'center',
      width: 100
    },
    {
      key: 'lineCode',
      title: $t('page.manufacture.line.lineCode'),
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
          <NButton type="primary" ghost size="small" onClick={() => onPublish(row.id)}>
            {$t('page.manufacture.line.publish')}
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
  await deleteLines(checkedRowKeys.value);
  await onBatchDeleted();
}

function handleDelete(id: string) {
  // request
  console.log(id);
  deleteLines([id]).then(() => {
    onDeleted();
  });
}

function edit(id: number) {
  handleEdit(id);
}

function onPublish(id: string) {
  publishProduct(id);
}

const onSubmit = item => {
  console.log(item);
  if (operateType.value === 'add') {
    addLine(item).then(() => {
      getData();
    });
  }
  if (operateType.value === 'edit') {
    editLine(item).then(() => {
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
    <line-search v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard
      :title="$t('page.manufacture.line.title')"
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
      <line-operate-drawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="onSubmit"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
