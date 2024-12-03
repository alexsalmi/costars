'use server';
import { unstable_cache } from 'next/cache';
// import { getCredits, getTrending, randomPerson } from "./tmdb.service";
import { randomPerson } from "./tmdb.service";

export const fetchDailyCostars = unstable_cache(async () => {
  console.log("----- Refreshing Daily Costars -----");

  const target = await randomPerson();
  const targetSet = new Set(target.credits);

  let starter = await randomPerson();

  while (starter.credits!.some(c => targetSet.has(c))) {
    starter = await randomPerson();
  }

  console.log("----- Finished Refreshing Daily Costars -----");
  console.log(`New daily costars are ${target.label} and ${starter.label}`)

  return {
    target,
    starter
  };
}, ['daily_costars'], {tags: ['daily_costars']});

export const getDailyCostars = async () => {

  return await fetchDailyCostars();
}


// export const fetchRandomPool = unstable_cache(async () => {
// 	const results: Array<GameEntity> = [];

//   for(let pass=1; pass<=5; pass++) {
//     const promises: Promise<Array<GameEntity>>[] = [];

//     for(let page=1; page<=10; page++) {
//       const promise = getTrending(pass*page)
//         .then(people => {
//           return people.filter(person => 
//             person.known_for_department === "Acting" &&
//             person.popularity > 50
//           )
//         }).then(people => {
//           return people.map(person => ({
//             id: person.id,
//             label: person.name,
//             image: person.profile_path,
//             type: 'person' as TmdbType
//           }))
//         });
  
//       promises.push(promise);
//     }

//     const responses = await Promise.all(promises);

//     const creditsPromises: Array<Promise<GameEntity>[]> = [];

//     for(const people of responses) {
//       const promise = people.map(async person => {
//         person.credits = (await getCredits(person)).cast.map(credit => credit.id);
//         return person;
//       })

//       creditsPromises.push(promise);
//     }
    
//     const creditsResponses = await Promise.all(creditsPromises);

//     for(const people of creditsResponses) {
//       results.push(...people);
//     }
    
//   }

// 	let credits: Array<MovieCredit>;
// 	let personEntity: GameEntity;

// 	do {
// 		const randomPerson = results[Math.floor(Math.random() * results.length)];
		
// 		personEntity = {
// 			id: randomPerson.id,
// 			label: randomPerson.name,
// 			image: randomPerson.profile_path,
// 			type: 'person'
// 		};

// 		credits = (await getCredits(personEntity)).cast as Array<MovieCredit>;
	
// 		personEntity.credits = credits.map(credit => credit.id);
// 	} while (credits.some(credit => credit.original_language === 'ko') || !credits.some(credit => credit.original_language === 'en'))

// 	return personEntity;

// }, ['random_pool'], {tags: ['random_pool']});