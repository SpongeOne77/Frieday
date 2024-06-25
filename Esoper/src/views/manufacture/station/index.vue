<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import {addProduct, addStation, editLine, editStation, getStations} from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import StationOperateDrawer from './modules/station-operate-drawer.vue';
import StationSearch from './modules/station-search.vue';

const appStore = useAppStore();

const { columns, columnChecks, data, getData, loading, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: getStations,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    onlineStatus: null,
    stationName: null,
    stationCode: null,
    stationType: null,
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
      key: 'stationCode',
      title: $t('page.manufacture.station.stationCode'),
      align: 'center',
      width: 100
    },
    {
      key: 'stationType',
      title: $t('page.manufacture.station.stationType'),
      align: 'center',
      width: 100,
      render: row => {
        return <NTag type="primary">{row.stationType}</NTag>;
      }
    },
    {
      key: 'stationName',
      title: $t('page.manufacture.station.stationName'),
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

  onBatchDeleted();
}

function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}

const onSubmit = item => {
  console.log(item);
  if (operateType.value === 'add') {
    addStation(item).then(() => {
      getData();
    });
  }
  if (operateType.value === 'edit') {
    editStation(item).then(() => {
      getData();
    });
  }
};
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <StationSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard :title="$t('page.manufacture.station.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
      <StationOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="onSubmit"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
