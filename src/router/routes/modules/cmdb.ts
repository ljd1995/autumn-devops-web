import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const cmdb: AppRouteModule = {
  path: '/assets',
  name: 'Assets',
  component: LAYOUT,
  redirect: '/assets/host',
  meta: {
    orderNo: 2000,
    icon: 'ant-design:group-outlined',
    title: t('routes.cmdb.assets'),
  },
  children: [
    {
      path: 'host',
      name: 'HostManagement',
      meta: {
        title: t('routes.cmdb.host'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/cmdb/host/index.vue'),
    },
    {
      path: 'database',
      name: 'DatabaseManagement',
      meta: {
        title: t('routes.cmdb.database'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/cmdb/db/index.vue'),
    },
    {
      path: 'config',
      name: 'ConfigManagement',
      meta: {
        title: t('routes.cmdb.configuration'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/cmdb/configCenter/index.vue'),
    },
    {
      path: 'db_operator',
      name: 'DbOperator',
      meta: {
        hideMenu: true,
        title: t('routes.cmdb.dbOperator'),
        showMenu: false,
        currentActiveMenu: '/assets/database',
      },
      component: () => import('/@/views/cmdb/db/DbOperator.vue'),
    },
  ],
};

export default cmdb;
