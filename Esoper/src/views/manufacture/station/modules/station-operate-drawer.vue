<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { enableStatusOptions } from '@/constants/business';

defineOptions({
  name: 'StationOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Manufacture.Station | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted', model: Model): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manufacture.station.addStation'),
    edit: $t('page.manufacture.station.editStation')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.Manufacture.Station, any>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    stationName: '',
    stationCode: '',
    stationType: '',
    lineCode: '',
    stationIp: ''
  };
}

type RuleKey = Extract<keyof Model, 'stationCode' | 'stationName' | 'stationIp' | 'stationType'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  stationName: defaultRequiredRule,
  stationCode: defaultRequiredRule,
  stationType: defaultRequiredRule,
  stationIp: defaultRequiredRule
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

async function handleSubmit() {
  await validate();
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted', model);
}

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
        <NFormItem :label="$t('page.manufacture.station.stationName')" path="stationName">
          <NInput v-model:value="model.stationName" :placeholder="$t('page.manufacture.station.form.stationName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.station.stationCode')" path="stationCode">
          <NInput v-model:value="model.stationCode" :placeholder="$t('page.manufacture.station.form.stationCode')" />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.station.stationType')" path="stationType">
          <NInput v-model:value="model.stationType" :placeholder="$t('page.manufacture.station.form.stationType')" />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.station.stationIp')" path="stationIp">
          <NInput v-model:value="model.stationIp" :placeholder="$t('page.manufacture.station.form.stationIp')" />
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
