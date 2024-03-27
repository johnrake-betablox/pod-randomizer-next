import { Day } from "@/lib/randomizer";

export const DayCard = ({
  day,
  search,
  players,
}: {
  day: Day;
  search: string;
  players: string[];
}) => {
  const scheduled = day.pods.map((pod) => pod.players).flat();
  const notScheduled = players.filter((p) => scheduled.includes(p) === false);

  return (
    <div className="w-full mb-10 px-6 py-4 border bg-white shadow rounded table">
      <h4 className="text-xl font-bold mb-6">{day.name}</h4>
      <div className="flex flex-row gap-x-10">
        {day.pods.map((pod) => (
          <div key={pod.name}>
            <h3 className="text-lg mb-4">{pod.name}</h3>
            <ul>
              {pod.players.map((player) => (
                <li
                  key={player}
                  className="mb-2"
                  style={{
                    opacity: player.toLowerCase().includes(search.toLowerCase())
                      ? 1
                      : 0.2,
                  }}
                >
                  {player}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {notScheduled.length > 0 && (
        <div className="p-4 bg-gray-100 mt-10 rounded">
          <p className="font-medium mb-2">Not Scheduled Yet</p>
          {notScheduled.map((player) => (
            <div key={player} className="mb-2">
              {player}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
