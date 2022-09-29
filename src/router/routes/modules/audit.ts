import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const audit: AppRouteModule = {
  path: '/audit',
  name: 'Audit',
  component: LAYOUT,
  redirect: '/audit/operator-history',
  meta: {
    orderNo: 3900,
    icon: 'arcticons:auditor',
    title: t('routes.audit.auditManage'),
  },
  children: [
    {
      path: 'operator-history',
      name: 'OperatorHistory',
      meta: {
        title: t('routes.audit.operatorHistory'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/audit/operatorAudit/index.vue'),
    },
    {
      path: 'ssh-history',
      name: 'SshHistory',
      meta: {
        title: t('routes.audit.sshHistory'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/audit/sshAudit/index.vue'),
    },
  ],
};

export default audit;
