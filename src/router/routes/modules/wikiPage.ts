import { AppRouteModule } from '../../types';
import { t } from '/@/hooks/web/useI18n';

const page: AppRouteModule = {
  path: '/wiki/page',
  name: 'WikiPage',
  meta: {
    hideMenu: true,
    title: t('routes.wiki.page'),
    showMenu: false,
  },
  component: () => import('/@/views/wiki/page/index.vue'),
};

export default page;
