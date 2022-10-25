<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    width="50%"
    showFooter
    @ok="handleOk"
  >
    <BasicForm @register="registerForm" />
    <div>
      <Row class="ml-27">
        <Col :span="1"><span>主机</span></Col>
        <Col :span="22"
          ><Transfer
            v-model:target-keys="targetKeys"
            :data-source="hostData"
            show-search
            show-select-all
            :titles="['  所有主机', '  已选择主机']"
            :render="(item) => `${item.external_ip}(${item.remark})`"
            :rowKey="(item) => item.id + ''"
            :list-style="listStyle"
        /></Col>
      </Row>
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup name="ApplicationDrawer">
  import { computed, onMounted, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { envGroupFormSchema } from './application.data';
  import { Transfer, Row, Col } from 'ant-design-vue';
  import { getHostPageList } from '/@/api/cmdb/host';
  import { HostListItem } from '/@/api/cmdb/model/hostModel';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(false);
  const rowId = ref('');

  const listStyle = ref({
    width: '470px',
    height: '400px',
  });

  const targetKeys = ref<string[]>([]);
  const hostData = ref<HostListItem[]>([]);

  const [registerForm, { resetFields, validate, setFieldsValue }] = useForm({
    labelWidth: 140,
    baseColProps: { span: 24 },
    schemas: envGroupFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    targetKeys.value = [];
    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      setFieldsValue({
        ...data.record,
        environment_id: data.record.environment.id,
        db_id: data.record.db.id,
        config_center_id: data.record.config_center.id,
      });
      targetKeys.value = data.record.hosts.map((item) => item.id + '');
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增环境组' : '编辑环境组'));

  const handleOk = async () => {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      const hosts = hostData.value.filter((item) => targetKeys.value.indexOf(item.id + '') > -1);
      emit('success', {
        isUpdate: unref(isUpdate),
        values: { ...values, id: rowId.value, hosts: hosts },
      });
      closeDrawer();
    } catch (e) {
      console.log(e);
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  const fetch = () => {
    getHostPageList({ page: 1, page_size: 3000 }).then((resp) => {
      hostData.value = resp.items;
    });
  };

  onMounted(() => {
    fetch();
  });
</script>
<style lang="less"></style>
