'use client';
import { useState } from 'react';
import CSCostarsCreator from '../inputs/costars-creator';
import CSButton from '../inputs/buttons/button';
import { Input } from '@mui/material';
import { revalidatePath } from 'next/cache';
import { getDayNumber } from '@/utils/utils';
import {
  sb_DeleteSolutions,
  sb_PostDailyCostars,
  sb_PostSolutions,
  sb_UpdateDailyCostars,
} from '@/services/supabase';
import '@/styles/presentation/costars-editor.scss';
import { getOptimalSolutions } from '@/utils/costars';

interface ICSCostarsEditorProps {
  costars?: DailyCostars;
}

export default function CSCostarsEditor({ costars }: ICSCostarsEditorProps) {
  const [editing, setEditing] = useState(false);
  const [starter, setStarter] = useState(costars?.starter || null);
  const [target, setTarget] = useState(costars?.target || null);
  const [date, setDate] = useState(costars?.date || null);
  const [error, setError] = useState('');

  const cancel = () => {
    setStarter(costars?.starter || null);
    setTarget(costars?.target || null);
    setDate(costars?.date || null);
    setEditing(false);
  };

  const save = async () => {
    if (!starter || !target) {
      setError('Select both a starter and a target');
      return;
    }

    const solutions = await getOptimalSolutions(starter, target);

    if (solutions === null) {
      setError(`Isn't possible in min 2 moves`);
      return;
    }

    const newCostars: DailyCostars = {
      starter,
      target,
      date: date!,
      num_solutions: solutions.total_count,
      day_number: getDayNumber(date!),
    };

    let daily_id: number | null;

    if (costars === undefined) {
      daily_id = await sb_PostDailyCostars(newCostars);
    } else {
      daily_id = costars.id!;

      await sb_DeleteSolutions({
        daily_id,
        is_daily_optimal: true,
      });

      await sb_UpdateDailyCostars(newCostars);
    }

    await sb_PostSolutions(
      solutions.solutions.map((solution) => ({
        daily_id,
        solution,
        is_daily_optimal: true,
      })),
    );

    setEditing(false);
    revalidatePath('/admin');
    window.location.reload();
  };

  return (
    <div className='costars-editor-container'>
      <div className='costars-editor-header'>
        <h3>
          {date
            ? `${new Date(date).toUTCString().split(' ').slice(0, 4).join(' ')} (#${costars?.day_number || 'N/A'})`
            : 'New Costars'}
        </h3>
        {!editing ? (
          <CSButton secondary onClick={() => setEditing(true)}>
            {costars ? 'Edit' : 'Add'}
          </CSButton>
        ) : !costars ? (
          <span className='costars-editor-date-picker'>
            <Input
              type='date'
              value={date || ''}
              onChange={(e) => setDate(e.target.value)}
            />
          </span>
        ) : (
          <></>
        )}
      </div>
      {costars || editing ? (
        <CSCostarsCreator
          target={target}
          setTarget={setTarget}
          starter={starter}
          setStarter={setStarter}
          editing={editing}
        />
      ) : (
        <></>
      )}
      {error ? <div>{error}</div> : <></>}
      {editing ? (
        <div className='costars-editor-buttons-container'>
          <CSButton secondary onClick={cancel}>
            Cancel
          </CSButton>
          <CSButton onClick={save}>Save</CSButton>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
