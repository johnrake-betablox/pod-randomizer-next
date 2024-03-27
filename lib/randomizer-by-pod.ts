export type Pod = {
  name: string;
  judge: string;
  players: string[];
};
export type Day = {
  name: string;
  pods: Pod[];
};
export type Season = {
  name: string;
  days: Day[];
  allPlayers: string[];
};

export type PlacementOptions = {
  playersPerPod: number;
  excessPlayers: number;
};

export function createSeasonByPod(
  name: string,
  numPods: number,
  numPlayers: number
): Season {
  const playersPerPod = Math.floor(numPlayers / numPods);
  const excessPlayers = numPlayers - playersPerPod * numPods;

  const players = [...Array(numPlayers).keys()].map(
    (index: number) => `${index + 1}`
  );

  const placementOptions: PlacementOptions = {
    playersPerPod,
    excessPlayers,
  };

  console.log(
    [
      `Total players: ${players.length}`,
      `Players per pod: ${placementOptions.playersPerPod}`,
      `Remaining players: ${placementOptions.excessPlayers}`,
    ].join("\n")
  );

  const days: Day[] = [
    createDefaultDay("Day 1", numPods),
    createDefaultDay("Day 2", numPods),
    createDefaultDay("Day 3", numPods),
    createDefaultDay("Day 4", numPods),
    createDefaultDay("Day 5", numPods),
  ];

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    // console.log(`${day.name}: Placing players in pods`);

    const shuffledPlayers = shuffle<string>(players);

    for (let j = 0; j < numPods; j++) {
      const pod = day.pods[j];
      putPlayersInPod(pod, day, days, placementOptions, shuffledPlayers);
    }

    console.log(`${day.name}: Done placing players`);
    // ${JSON.stringify(day, null, 4)}
  }

  return {
    name,
    days,
    allPlayers: players,
  };
}

function createDefaultDay(name: string, numPods: number): Day {
  const pods: Pod[] = [...Array(numPods).keys()].map((index: number) => ({
    name: `Pod ${index + 1}`,
    judge: `Judge ${index + 1}`,
    players: [],
  }));

  return {
    name,
    pods,
  };
}

export function putPlayersInPod(
  pod: Pod,
  day: Day,
  days: Day[],
  placementOptions: PlacementOptions,
  players: string[]
) {
  // const prevPlayers = players.filter((p) => playerHasBeenInPod(p, pod, days));
  const playersInPods = day.pods.map((pod) => pod.players).flat();
  const possiblePlayers = players
    // player has not been in pod
    .filter((p) => playerHasBeenInPod(p, pod, days) === false)
    // player is not already scheduled for the day
    .filter((p) => playersInPods.includes(p) === false);
  // const podIsFull = pod.players.length === placementOptions.playersPerPod;

  const podPlayers = shuffle(possiblePlayers).splice(
    0,
    placementOptions.playersPerPod
  );

  pod.players = [...podPlayers];
  // console.log(podPlayers);

  // console.debug(
  //   `${day.name}: Trying to put ${player} in ${pod.name}. hasBeenInPod: ${hasBeenInPod}, podIsFull: ${podIsFull}`
  // );

  // They're already been in the pod, try again with the next one
  // if (hasBeenInPod && next) {
  //   return putPlayer(player, next, day, days, placementOptions, players);
  // }

  // // The pod would be a good fit if it wasn't full, try the next one
  // if (!hasBeenInPod && podIsFull && next) {
  //   return putPlayer(player, next, day, days, placementOptions, players);
  // }

  // // The pod is new and open for new players
  // if (!hasBeenInPod && !podIsFull) {
  //   pod.players.push(player);
  //   // console.log(
  //   //   `${day.name}: Placing ${player} in ${
  //   //     pod.name
  //   //   }. Players: [${pod.players.join(" ")}]`
  //   // );
  //   return;
  // }

  // const swap = findSwap(players, pod, day, days);

  // if (swap) {
  //   return movePlayer(swap.player, swap.from, pod);
  // }

  // throw new Error(`Cannot find new pod for ${player}`);
}

function putPlayer(
  player: string,
  pod: Pod,
  day: Day,
  days: Day[],
  placementOptions: PlacementOptions,
  players: string[]
) {
  const index = day.pods.findIndex((p) => p.name === pod.name);
  const next = day.pods[index + 1];
  const hasBeenInPod = playerHasBeenInPod(player, pod, days);
  const podIsFull = pod.players.length === placementOptions.playersPerPod;

  // console.debug(
  //   `${day.name}: Trying to put ${player} in ${pod.name}. hasBeenInPod: ${hasBeenInPod}, podIsFull: ${podIsFull}`
  // );

  // They're already been in the pod, try again with the next one
  if (hasBeenInPod && next) {
    return putPlayer(player, next, day, days, placementOptions, players);
  }

  // The pod would be a good fit if it wasn't full, try the next one
  if (!hasBeenInPod && podIsFull && next) {
    return putPlayer(player, next, day, days, placementOptions, players);
  }

  // The pod is new and open for new players
  if (!hasBeenInPod && !podIsFull) {
    pod.players.push(player);
    // console.log(
    //   `${day.name}: Placing ${player} in ${
    //     pod.name
    //   }. Players: [${pod.players.join(" ")}]`
    // );
    return;
  }

  const swap = findSwap(players, pod, day, days);

  if (swap) {
    return movePlayer(swap.player, swap.from, pod);
  }

  throw new Error(`Cannot find new pod for ${player}`);
}

export function playerHasBeenInPod(
  player: string,
  pod: Pod,
  days: Day[]
): boolean {
  const prevPods = days
    .map((d) => d.pods)
    .flat()
    .filter((p) => p.name === pod.name);
  const prevPlayers = prevPods.map((p) => p.players).flat();

  return prevPlayers.includes(player);
}

export function movePlayer(player: string, from: Pod, to: Pod) {
  const fromIndex = from.players.findIndex((p) => p === player);
  from.players.splice(fromIndex, 1);
  to.players.push(player);
}

// Find a new player who could move into the pod as a swap
export function findSwap(
  players: string[],
  pod: Pod,
  day: Day,
  days: Day[]
): {
  player: string;
  from: Pod;
} {
  const newPlayers = players.filter(
    (p) => playerHasBeenInPod(p, pod, days) === false
  );

  if (newPlayers.length) {
    throw new Error(
      `Cannot find a player to swap in for ${day.name} ${pod.name}`
    );
  }

  const player = newPlayers[0];
  const from = day.pods.find((pod) => pod.players.includes(player));

  if (!player || !from) {
    throw new Error("Error swapping players");
  }

  return {
    player,
    from,
  };
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
