<template>
  <div class="flex">
    <Input
      v-model:value="quickCommand"
      class="w-1/4"
      placeholder="支持快速命令操作，请选择选项卡发送类型，并输入命令，然后使用回车键发送"
      @keyup.enter="sendQuickCommand"
    >
      <template #addonBefore>
        <Select v-model:value="commandSendType" style="width: 150px">
          <SelectOption value="current">当前选项卡</SelectOption>
          <SelectOption value="all">所有选项卡</SelectOption>
        </Select>
      </template>
    </Input>
    <div class="w-3/4 flex">
      <Upload
        :file-list="fileList"
        :max-count="1"
        name="file"
        :before-upload="beforeUpload"
        :showUploadList="false"
      >
        <a-button
          color="warning"
          preIcon="ant-design:cloud-upload-outlined"
          :loading="uploadLoading"
          >上传</a-button
        >
      </Upload>
      <Input v-model:value="filePath" :placeholder="filePathPlaceholder" />
      <a-button
        color="success"
        preIcon="ant-design:cloud-download-outlined"
        @click="handleDownload"
        :loading="downloadLoading"
        >下载</a-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup name="TerminalExtra">
  import { Select, SelectOption, Input, Upload, UploadProps } from 'ant-design-vue';
  import { ref, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const quickCommand = ref('');
  const filePath = ref('');
  const commandSendType = ref('all');
  const fileList = ref<UploadProps['fileList']>([]);
  const uploadLoading = ref(false);
  const downloadLoading = ref(false);
  const filePathPlaceholder = ref(
    '请输入当前终端下要下载的文件全路径,文件上传下载过程中终端输入会阻塞',
  );

  const { createMessage } = useMessage();

  const props = defineProps({
    socketList: {
      type: Object,
      required: true,
    },
    activeKey: {
      type: String,
      required: true,
    },
  });

  const { socketList, activeKey } = toRefs(props);

  const sendQuickCommand = () => {
    if (!quickCommand.value) {
      createMessage.warning('当前命令为空，已取消发送，请检查！');
      return;
    }
    const commandMessage = JSON.stringify({
      data: quickCommand.value + '\n',
      type: 'content',
    });
    if (commandSendType.value == 'all') {
      for (let key in socketList.value) {
        console.log(key);
        socketList.value[key].send(commandMessage);
      }
    } else {
      socketList.value[activeKey.value].send(commandMessage);
    }
  };

  const handleDownload = () => {
    downloadLoading.value = true;
    createMessage.info('文件下载中，请等待，请注意文件下载过程中当前终端输入会阻塞');
    const fileDownloadMessage = JSON.stringify({
      data: filePath.value,
      type: 'download',
    });
    socketList.value[activeKey.value].send(fileDownloadMessage);
    setTimeout(() => {
      downloadLoading.value = false;
    }, 3000);
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    uploadLoading.value = true;
    const fileUploadMessage = JSON.stringify({
      data: file.name,
      type: 'upload',
    });
    fileList.value = [file];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onprogress = (e) => {
      const num = parseFloat(e.loaded);
      const total = parseFloat(e.total);
      if (isNaN(num) || isNaN(total)) {
        return 0;
      }
      const percent = total <= 0 ? 0 : Math.round((num / total) * 10000) / 100.0;
      filePathPlaceholder.value = `已上传：${percent}%`;
    };
    reader.onload = (result) => {
      const buffer = result?.target?.result;
      createMessage.info('文件上传中，请等待，请注意文件上传过程中当前终端输入会阻塞');
      socketList.value[activeKey.value].send(fileUploadMessage);
      socketList.value[activeKey.value].send(buffer);
      uploadLoading.value = false;
    };
    return false;
  };
</script>
