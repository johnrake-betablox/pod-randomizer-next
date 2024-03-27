import { Day } from "@/lib/randomizer";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

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
    <Card>
      <CardHeader>
        <CardTitle>{day.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-x-10">
          {day.pods.map((pod) => (
            <div key={pod.name}>
              <h3 className="text-sm font-bold mb-4">{pod.name}</h3>
              <ul>
                {pod.players.map((player) => {
                  let opacity = 1;

                  if (search) {
                    opacity =
                      player.toLowerCase() === search.toLowerCase() ? 1 : 0.2;
                  }

                  return (
                    <li
                      key={player}
                      className="mb-2"
                      style={{
                        opacity,
                      }}
                    >
                      {player}
                    </li>
                  );
                })}
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
      </CardContent>
    </Card>
  );
};
