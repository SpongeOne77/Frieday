<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { UploadFileInfo, UploadInst } from 'naive-ui';
import axios from 'axios';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { upload } from '@/service/api';

defineOptions({
  name: 'ProductOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Manufacture.Product | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted', model: Model): void;
}

interface UploadCustomRequestOptions {
  file: UploadFileInfo;
  action?: string;
  data?: Record<string, string> | (({ file }: { file: UploadFileInfo }) => Record<string, string>);
  withCredentials?: boolean;
  headers?: Record<string, string> | (({ file }: { file: UploadFileInfo }) => Record<string, string>);
  onProgress: (e: { percent: number }) => void;
  onFinish: () => void;
  onError: () => void;
}

const emit = defineEmits<Emits>();

const fileListLength = ref(0);
const uploadRef = ref<UploadInst | null>(null);

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manufacture.product.addProduct'),
    edit: $t('page.manufacture.product.editProduct')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.Manufacture.Line, any>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    fileIds: [],
    productCode: '',
    productText: '',
    productId: '',
    productName: ''
  };
}

type RuleKey = Extract<keyof Model, 'productName' | 'productCode'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  productName: defaultRequiredRule,
  productCode: defaultRequiredRule
};

function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
    fileListLength.value = model.files.length;
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

const handleFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  console.log('finish', file);
};

const handleChange = (options: { fileList: UploadFileInfo[] }) => {
  console.log(options);
  fileListLength.value = options.fileList.length;
};

const handleClick = () => {
  uploadRef.value?.submit();
};

const uploadRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress
}: UploadCustomRequestOptions) => {
  const formData = new FormData();
  if (data) {
    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
    });
  }
  formData.append('file', file.file as File);
  upload({
    file: formData,
    onProgressCallback: (percent: number) => {
      onProgress({ percent: Math.ceil(percent) });
    }
  })
    .then(response => {
      model.fileIds.push(response.data.data);
      // window.$message?.success($t('common.updateSuccess'));
    })
    .catch(error => {
      console.error('上传失败', error);
    });
};

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    // getRoleOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manufacture.product.productName')" path="productName">
          <NInput v-model:value="model.productName" :placeholder="$t('page.manufacture.product.productName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.product.productCode')" path="productCode">
          <NInput v-model:value="model.productCode" :placeholder="$t('page.manufacture.product.productCode')" />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.product.productText')" path="productText">
          <NInput
            v-model:value="model.productText"
            :placeholder="$t('page.manufacture.product.productText')"
            type="textarea"
          />
        </NFormItem>
        <NFormItem :label="$t('page.manufacture.product.fileIds')" path="fileIds">
          <div v-if="operateType === 'edit'">已上传 {{ fileListLength }}
            <NImageGroup show-toolbar-tooltip>
              <NSpace>
                <NImage v-for="item in model.files" :key="item.fileNewName" width="100" :src="`http://150.158.148.22/esop/${item.fileNewName}`"></NImage>
              </NSpace>
            </NImageGroup>
          </div>
          <NUpload
            v-if="operateType === 'add'"
            ref="uploadRef"
            :headers="{ 'Content-Type': 'multipart/form-data' }"
            multiple
            directory-dnd
            :custom-request="uploadRequest"
            @change="handleChange"
            @finish="handleFinish"
          >
            <NUploadDragger>
              <div>
                <NIcon size="48" :depth="3">
                  <!--                  <archive-icon />-->
                </NIcon>
              </div>
              <NText class="text-xl">点击或者拖动文件到该区域来上传</NText>
            </NUploadDragger>
          </NUpload>
          <!--            <NButton :disabled="!fileListLength" type="info" class="mb-3" @click="handleClick">上传文件</NButton>-->
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
