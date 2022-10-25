import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const deploy: AppRouteModule = {
  path: '/deploy',
  name: 'Deploy',
  component: LAYOUT,
  redirect: '/deploy/artifact',
  meta: {
    orderNo: 3600,
    icon: 'simple-icons:azuredevops',
    title: t('routes.deploy.deployment'),
  },
  children: [
    {
      path: 'artifact',
      name: 'ArtifactManagement',
      meta: {
        title: t('routes.deploy.artifact'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/deploy/artifact/index.vue'),
    },
    {
      path: 'application',
      name: 'ApplicationManagement',
      meta: {
        title: t('routes.deploy.application'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/deploy/application/index.vue'),
    },
    {
      path: 'environment',
      name: 'EnvironmentManagement',
      meta: {
        title: t('routes.deploy.environment'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/deploy/environment/index.vue'),
    },
    {
      path: 'artifact-info',
      name: 'ArtifactInfo',
      meta: {
        hideMenu: true,
        title: t('routes.deploy.artifactInfo'),
        showMenu: false,
        currentActiveMenu: '/deploy/artifact',
      },
      component: () => import('/@/views/deploy/artifact/ArtifactInfo.vue'),
    },
    {
      path: 'application-info',
      name: 'ApplicationInfo',
      meta: {
        hideMenu: true,
        title: t('routes.deploy.applicationInfo'),
        showMenu: false,
        currentActiveMenu: '/deploy/application',
      },
      component: () => import('/@/views/deploy/application/ApplicationInfo.vue'),
    },
  ],
};

export default deploy;
