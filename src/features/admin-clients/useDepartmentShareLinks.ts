import { useQuery } from '@tanstack/react-query';

import { clientsApi } from './clients.api';
import { queryKeys } from '@/lib/query-client';

export function useDepartmentShareLinks(clientId: string, departmentId: string) {
  return useQuery({
    queryKey: queryKeys.adminClients.departmentShareLinks(clientId, departmentId),
    queryFn: () => clientsApi.getDepartmentShareLinks(clientId, departmentId),
    enabled: Boolean(clientId && departmentId),
  });
}
