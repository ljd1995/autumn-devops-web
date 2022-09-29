import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const job: AppRouteModule = {
  path: '/job-platform',
  name: 'JobPlatform',
  component: LAYOUT,
  redirect: '/job-platform/adhoc',
  meta: {
    orderNo: 3500,
    icon: 'eos-icons:job',
    title: t('routes.job.jobPlatform'),
  },
  children: [
    {
      path: 'adhoc',
      name: 'AdhocManagement',
      meta: {
        title: t('routes.job.adhoc'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/jobPlatform/adhoc/index.vue'),
    },
    {
      path: 'playbook',
      name: 'PlaybookManagement',
      meta: {
        title: t('routes.job.playbook'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/jobPlatform/playbook/index.vue'),
    },
    {
      path: 'script',
      name: 'ScriptManagement',
      meta: {
        title: t('routes.job.script'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/jobPlatform/script/index.vue'),
    },
    {
      path: 'roles',
      name: 'RolesManagement',
      meta: {
        title: t('routes.job.roles'),
        ignoreKeepAlive: false,
        hideMenu: true,
      },
      component: () => import('/@/views/jobPlatform/roles/index.vue'),
    },
  ],
};

export default job;
