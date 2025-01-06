import CSArchive from '@/components/game/archive';
import { getMonthsCostars } from '@/services/cache.service';

export default async function Archive() {
  const costars = await getMonthsCostars();

  return <CSArchive costars={costars || []} />;
}
