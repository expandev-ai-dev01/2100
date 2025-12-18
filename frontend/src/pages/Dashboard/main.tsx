import { useState } from 'react';
import { Button } from '@/core/components/button';
import { RefreshCwIcon } from 'lucide-react';
import { useDashboardData } from '@/domain/dashboard/hooks/useDashboardData';
import { MetricsWidget } from '@/domain/dashboard/components/MetricsWidget';
import { ChartsWidget } from '@/domain/dashboard/components/ChartsWidget';
import { ActivitiesWidget } from '@/domain/dashboard/components/ActivitiesWidget';
import { QuickAccessWidget } from '@/domain/dashboard/components/QuickAccessWidget';
import { DashboardFilters } from '@/domain/dashboard/components/DashboardFilters';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { formatRelativeTime } from '@/core/utils/date';
import type { DashboardFilters as FilterType } from '@/domain/dashboard/types/models';

function DashboardPage() {
  const [filters, setFilters] = useState<FilterType>({ period: 'last_month' });
  const { data, isLoading, refetch, lastUpdated, isIdle } = useDashboardData({ filters });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isIdle ? 'Atualização pausada (inatividade)' : 'Atualização automática ativa'}
            {lastUpdated && ` • Última atualização ${formatRelativeTime(new Date(lastUpdated))}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardFilters filters={filters} onFilterChange={setFilters} />
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Atualizar dados
          </Button>
        </div>
      </div>

      <MetricsWidget metrics={data.metrics} visibility={data.preferences.metrics} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 md:col-span-2 lg:col-span-5">
          <ChartsWidget charts={data.charts} visibility={data.preferences.charts} />
        </div>
        <div className="col-span-1 space-y-6 md:col-span-2 lg:col-span-2">
          {data.preferences.sections.quick_access && <QuickAccessWidget />}
          {data.preferences.sections.activities && (
            <ActivitiesWidget activities={data.activities} />
          )}
        </div>
      </div>
    </div>
  );
}

export { DashboardPage };
