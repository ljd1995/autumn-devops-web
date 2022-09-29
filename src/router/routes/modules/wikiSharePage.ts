import { AppRouteModule } from '../../types';
import { t } from '/@/hooks/web/useI18n';

const page: AppRouteModule = {
  path: '/wiki/share-page',
  name: 'WikiSharePage',
  meta: {
    hideMenu: true,
    title: t('routes.wiki.share'),
    showMenu: false,
  },
  component: () => import('/@/views/wiki/page/SharePage.vue'),
};

export default page;
