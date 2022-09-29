import type { AppRouteModule } from '/@/router/types';

import { t } from '/@/hooks/web/useI18n';

const terminal: AppRouteModule = {
  path: '/terminal',
  name: 'Terminal',
  meta: {
    hideMenu: true,
    title: t('routes.cmdb.terminal'),
    showMenu: false,
  },
  component: () => import('/@/views/cmdb/terminal/index.vue'),
};

export default terminal;
