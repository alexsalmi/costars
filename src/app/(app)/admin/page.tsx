import CSCostarsEditor from '@/components/presentation/costars-editor';
import { sb_GetDailyCostars } from '@/services/supabase';
import '@/styles/pages/admin.scss';

export default async function Admin() {
  if (process.env.IS_PRODUCTION) return <></>;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const futureCostars =
    (await sb_GetDailyCostars({
      after_date: tomorrow.toISOString(),
    })) || [];

  return (
    <div className='admin-page-container'>
      {futureCostars.map((costars) => (
        <CSCostarsEditor key={costars.target.id} costars={costars} />
      ))}
      <CSCostarsEditor />
    </div>
  );
}
