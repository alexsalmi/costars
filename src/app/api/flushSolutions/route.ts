import { deleteOldSolutions } from '@/services/db.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	if (process.env.NODE_ENV === 'production' && 
		req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return NextResponse.json({error: 'Unauthorized'}, {status: 401, statusText: "Unauthorized"});
	}

	console.log(`----- CLEANING OUT OLD SOLUTIONS -----`);

	await deleteOldSolutions();

	console.log('----- FINISHED CLEANING OUT OLD SOLUTIONS -----')

	return NextResponse.json({ok: true});
}
