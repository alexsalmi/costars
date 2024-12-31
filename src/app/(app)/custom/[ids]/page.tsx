import { getCredits, getDetails } from '@/services/tmdb.service';
import CSGameContainer from '@/components/game/game-container';

interface ICustomGameProps {
  params: Promise<{ ids: string }>;
}

export default async function CustomGame({ params }: ICustomGameProps) {
  const ids = (await params).ids.split('..');

  if (ids.length !== 2 || parseInt(ids[0], 36) == parseInt(ids[1], 36))
    throw Error('Invalid URL');

  const targetId = parseInt(ids[0], 36);
  const starterId = parseInt(ids[1], 36);

  const [target, starter] = (await Promise.all([
    getDetails(targetId, 'person'),
    getDetails(starterId, 'person'),
  ])) as Array<PersonDetails>;

  if (
    target.known_for_department !== 'Acting' ||
    starter.known_for_department !== 'Acting'
  )
    throw Error('Invalid people');

  const targetEntity: GameEntity = {
    type: 'person',
    id: target.id,
    label: target.name,
    image: target.profile_path,
  };

  const starterEntity: GameEntity = {
    type: 'person',
    id: starter.id,
    label: starter.name,
    image: starter.profile_path,
  };

  targetEntity.credits = (await getCredits(targetEntity.id, 'person')).map(
    (credit) => credit.id,
  );
  starterEntity.credits = (await getCredits(starterEntity.id, 'person')).map(
    (credit) => credit.id,
  );

  return <CSGameContainer initPeople={[targetEntity, starterEntity]} />;
}
