<template>
  <PageWrapper title="关于">
    <template #headerContent>
      <div class="flex justify-between items-center">
        <span class="flex-1">
          <a :href="GITHUB_URL" target="_blank">{{ name }}</a>
          是一个前端基于Vue Vben Admin, 后端基于Python3.10 FastAPI 框架开发的一站式DevOps解决方案,
          目标是为中小型公司提供现成的DevOps管理平台。
        </span>
      </div>
    </template>
    <Description @register="infoRegister" class="enter-y" />
    <Description @register="registerPython" class="my-4 enter-y" />
    <Description @register="register" class="my-4 enter-y" />
    <Description @register="registerDev" class="enter-y" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { h, onMounted, ref, unref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  import { GITHUB_URL, SITE_URL, DOC_URL } from '/@/settings/siteSetting';
  import { getDependencies } from '/@/api/common/dependencies';

  const { pkg, lastBuildTime } = __APP_INFO__;

  const { dependencies, devDependencies, author, name, version } = pkg;

  const schema: DescItem[] = [];
  const devSchema: DescItem[] = [];
  const pythonSchema: DescItem[] = [];

  let pythonDependencies = ref();

  const commonTagRender = (color: string) => (curVal) => h(Tag, { color }, () => curVal);
  const commonLinkRender = (text: string) => (href) => h('a', { href, target: '_blank' }, text);

  const fetch = async () => {
    pythonDependencies.value = await getDependencies();
    Object.keys(pythonDependencies.value).forEach((key) => {
      pythonSchema.push({ field: key, label: key });
    });
  };

  const infoSchema: DescItem[] = [
    {
      label: '作者',
      field: 'name',
      render: commonTagRender('green'),
    },
    {
      label: '邮箱',
      field: 'email',
      render: commonTagRender('pink'),
    },
    {
      label: '博客',
      field: 'url',
      render: commonLinkRender('博客'),
    },
    {
      label: '版本',
      field: 'version',
      render: commonTagRender('blue'),
    },
    {
      label: '最后编译时间',
      field: 'lastBuildTime',
      render: commonTagRender('blue'),
    },
    {
      label: '文档地址',
      field: 'doc',
      render: commonLinkRender('文档地址'),
    },
    {
      label: '预览地址',
      field: 'preview',
      render: commonLinkRender('预览地址'),
    },
    {
      label: 'Github',
      field: 'github',
      render: commonLinkRender('Github'),
    },
  ];

  const infoData = {
    version,
    lastBuildTime,
    ...author,
    doc: DOC_URL,
    preview: SITE_URL,
    github: GITHUB_URL,
  };

  Object.keys(dependencies).forEach((key) => {
    schema.push({ field: key, label: key });
  });

  Object.keys(devDependencies).forEach((key) => {
    devSchema.push({ field: key, label: key });
  });

  const [register] = useDescription({
    title: '前端生产环境依赖',
    data: dependencies,
    schema: schema,
    column: 5,
  });

  const [registerDev] = useDescription({
    title: '前端开发环境依赖',
    data: devDependencies,
    schema: devSchema,
    column: 5,
  });

  const [registerPython] = useDescription({
    title: '后端生产环境依赖',
    data: pythonDependencies,
    schema: pythonSchema,
    column: 5,
  });

  const [infoRegister] = useDescription({
    title: '项目信息',
    data: infoData,
    schema: infoSchema,
    column: 2,
  });

  onMounted(() => {
    fetch();
  });
</script>
