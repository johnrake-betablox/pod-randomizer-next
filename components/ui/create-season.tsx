"use client";

import { Day, Season, createSeasonByPod } from "@/lib/randomizer-by-pod";
import { useState } from "react";
import { DayCard } from "./day-card";
import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { Label } from "./label";
import { Input } from "./input";

export default function CreateSeason() {
  const [season, setSeason] = useState<Season>();
  //   const [fetching, setFetching] = useState(false);
  //   const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const createSeason = (data: FormData) => {
    const podCount = parseInt(String(data.get("pods")), 10);
    const playerCount = parseInt(String(data.get("players")), 10);

    console.log(podCount, playerCount);

    if (!podCount || !playerCount) {
      return;
    }

    const newSeason = createSeasonByPod("Season 14", podCount, playerCount);

    setSeason(newSeason);
  };

  const scheduledCount = (day: Day): number => {
    if (!day) return 0;

    return day.pods.map((pod) => pod.players).flat().length;
  };

  const notScheduledCount = (season: Season, day: Day): number => {
    const scheduled = day.pods.map((pod) => pod.players).flat();
    return season.allPlayers.filter((p) => scheduled.includes(p) === false)
      .length;
  };

  const totalNotScheduledCount = (season: Season): number => {
    return (
      notScheduledCount(season, season.days[0]) +
      notScheduledCount(season, season.days[1]) +
      notScheduledCount(season, season.days[2]) +
      notScheduledCount(season, season.days[3]) +
      notScheduledCount(season, season.days[4])
    );
  };

  return (
    <div className="container mx-auto px-4 w-full h-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSeason(new FormData(e.currentTarget));
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Randomize Pods</CardTitle>
            <CardDescription>
              Create a randomized group of pods and players
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Label htmlFor="pods">Pods</Label>
              <Input type="number" id="pods" name="pods" required />
            </div>
            <div className="mt-2">
              <Label htmlFor="players">Players</Label>
              <Input type="number" id="players" name="players" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Go</Button>
          </CardFooter>
        </Card>
      </form>

      {season && (
        <div className="mt-10">
          <div className="mb-4 grid sm:grid-cols-4 gap-x-10">
            <div className="sm:col-span-3">
              <h2 className="text-lg">
                Not Scheduled: {totalNotScheduledCount(season)}
              </h2>
            </div>
            <input
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="player # (e.g. 1, 24, 122)"
            />
          </div>
          <DayCard
            day={season.days[0]}
            players={season.allPlayers}
            search={search}
          />
          <DayCard
            day={season.days[1]}
            players={season.allPlayers}
            search={search}
          />
          <DayCard
            day={season.days[2]}
            players={season.allPlayers}
            search={search}
          />
          <DayCard
            day={season.days[3]}
            players={season.allPlayers}
            search={search}
          />
          <DayCard
            day={season.days[4]}
            players={season.allPlayers}
            search={search}
          />
          {/* <hr />
              <p>{String(dupesMessage(season))}</p> */}
        </div>
      )}

      {/* {error && (
            <p className="bg-red-100 text-red-600 p-4 border border-red-300 rounded mt-10">
              Failed to create unique pods. Try again
            </p>
          )} */}
    </div>
  );
}
