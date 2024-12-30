import Home from './home';
import { getTodaysCostars } from '@/services/cache.service';

export default async function Index() {
  const daily = await getTodaysCostars();

  return <Home daily={daily} />;
}
