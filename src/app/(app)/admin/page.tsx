import CSCostarsEditor from "@/components/presentation/costars-editor";
import { supabase_getAllFutureCostars } from "@/services/supabase.service";
import '@/styles/pages/admin.scss';

export default async function Admin() {
	if(process.env.IS_PRODUCTION)
		return <></>

	const futureCostars = await supabase_getAllFutureCostars();

	return (
		<div className="admin-page-container">
			{futureCostars.map(costars => 
				<CSCostarsEditor key={costars.target.id} costars={costars} />
			)}
			<CSCostarsEditor />
		</div>
	);
}
