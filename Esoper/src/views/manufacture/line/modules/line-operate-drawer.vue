<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from 'vue';
import type { SelectOption } from 'naive-ui';
import {useFormRules, useNaiveForm} from '@/hooks/common/form';
import { getProductsDropDown } from '@/service/api';
import {$t} from '@/locales';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Manufacture.Line | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted', model: Model): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const {formRef, validate, restoreValidation} = useNaiveForm();
const {defaultRequiredRule} = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manufacture.line.addLine'),
    edit: $t('page.manufacture.line.editLine')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.Manufacture.Line, any>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    lineName: '',
    lineCode: '',
    productId: '',
    stations: []
  };
}
const optionsRef = ref<SelectOption[]>([]);
const optionsBase = ref([]);
const loadingRef = ref(false);

type RuleKey = Extract<keyof Model, 'lineCode' | 'lineName'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  lineCode: defaultRequiredRule,
  lineName: defaultRequiredRule
};


function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

const handleSearch =  (query: string) => {
  if (!query.length || optionsBase.value.length === 0) {
    optionsRef.value = [];
    return;
  }
  optionsRef.value = optionsBase.value.filter(
    (item) => item.productName.includes(query)
  );
};

async function handleSubmit() {
  await validate();
  console.log(model);
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted', model);
}

onMounted(() => {
  loadingRef.value = true;
  getProductsDropDown().then(res => {
    optionsBase.value = res || [];
    loadingRef.value = false;
  });
});

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manufacture.line.lineName')" path="lineName">
          <NInput v-model:value="model.lineName" :placeholder="$t('page.manufacture.line.lineName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.line.lineCode')" path="lineCode">
          <NInput v-model:value="model.lineCode" :placeholder="$t('page.manufacture.line.lineCode')" />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.line.productId')" path="productId">
          <NSelect
            v-model:value="model.productId"
            label-field="productName"
            value-field="id"
            placeholder="请选择产品"
            :options="optionsBase"
            :loading="loadingRef"
            clearable
            filterable
            @search="handleSearch"
          ></NSelect>
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.line.stations')" path="stations">
          <NDynamicInput v-model:value="model.stations" show-sort-button placeholder="请输入工站编号" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
