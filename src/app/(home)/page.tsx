import { getDailyCostars } from '@/services/cache.service';
import Home from './home';

export default async function Index() {
  const { target, starter } = await getDailyCostars();

  return (
    <Home target={target} starter={starter}/>
  );
}
