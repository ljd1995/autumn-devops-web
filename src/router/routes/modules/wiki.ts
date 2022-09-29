import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const wiki: AppRouteModule = {
  path: '/wiki',
  name: 'Wiki',
  component: LAYOUT,
  redirect: '/wiki/zone',
  meta: {
    orderNo: 3800,
    icon: 'icomoon-free:wikipedia',
    title: t('routes.wiki.wiki'),
  },
  children: [
    {
      path: 'zone',
      name: 'WikiZone',
      meta: {
        title: t('routes.wiki.zone'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/wiki/zone/index.vue'),
    },
  ],
};

export default wiki;
