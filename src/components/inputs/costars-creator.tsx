'use client';
import CSButton from './buttons/button';
import CSSearchBar from './search-bar';
import { useState } from 'react';
import CSTextDisplay from '../presentation/display';
import { AutorenewOutlined, CloseOutlined } from '@mui/icons-material';
import '@/styles/inputs/costars-creator.scss';
import { getRandomPerson } from '@/utils/costars';

interface ICSCostarsCreatorProps {
  target: GameEntity | null;
  setTarget?: (entity: GameEntity | null) => void;
  starter: GameEntity | null;
  setStarter?: (entity: GameEntity | null) => void;
  editing?: boolean;
}

export default function CSCostarsCreator({
  target,
  setTarget = () => {},
  starter,
  setStarter = () => {},
  editing = true,
}: ICSCostarsCreatorProps) {
  const [targetLoading, setTargetLoading] = useState(false);
  const [starterLoading, setStarterLoading] = useState(false);

  const randomize = async (type: 'target' | 'starter') => {
    if (type === 'target') setTargetLoading(true);
    else setStarterLoading(true);

    const person = await getRandomPerson();

    if (type === 'target') {
      setTarget(person);
      setTargetLoading(false);
    } else {
      setStarter(person);
      setStarterLoading(false);
    }
  };

  return (
    <div className='generator-container'>
      <div className='generator-input-section'>
        {editing ? <span>To:</span> : <></>}
        <span className='generator-person-selector'>
          {target === null ? (
            <>
              <CSSearchBar onSubmit={setTarget} />
              <CSButton
                loading={targetLoading}
                onClick={() => randomize('target')}
              >
                <AutorenewOutlined />
              </CSButton>
            </>
          ) : (
            <>
              <CSTextDisplay>{target.label}</CSTextDisplay>
              {editing ? (
                <CSButton secondary onClick={() => setTarget(null)}>
                  <CloseOutlined />
                </CSButton>
              ) : (
                <></>
              )}
            </>
          )}
        </span>
      </div>
      <div className='generator-input-section'>
        {editing ? <span>From:</span> : <></>}
        <span className='generator-person-selector'>
          {starter === null ? (
            <>
              <CSSearchBar onSubmit={setStarter} />
              <CSButton
                loading={starterLoading}
                onClick={() => randomize('starter')}
              >
                <AutorenewOutlined />
              </CSButton>
            </>
          ) : (
            <>
              <CSTextDisplay>{starter.label}</CSTextDisplay>
              {editing ? (
                <CSButton secondary onClick={() => setStarter(null)}>
                  <CloseOutlined />
                </CSButton>
              ) : (
                <></>
              )}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
