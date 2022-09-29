import { AppRouteModule } from '../../types';
import { t } from '/@/hooks/web/useI18n';

const categoryPage: AppRouteModule = {
  path: '/wiki/category-page',
  name: 'CategoryPage',
  meta: {
    hideMenu: true,
    title: t('routes.wiki.categoryPage'),
    showMenu: false,
  },
  component: () => import('/@/views/wiki/categoryPage/index.vue'),
};

export default categoryPage;
