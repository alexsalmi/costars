import Home from './home';
import { getTodaysCostars } from '@/services/cache.service';

export default async function Index() {
  const { target, starter } = await getTodaysCostars();

  return (
    <Home target={target} starter={starter}/>
  );
}
