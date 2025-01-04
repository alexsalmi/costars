import Home from './home';
import { getTodaysCostars } from '@/services/cache.service';

export default async function Index() {
  const daily = await getTodaysCostars();
  if (!daily) throw Error("Couldn't get Costars");

  return <Home daily={daily} />;
}
