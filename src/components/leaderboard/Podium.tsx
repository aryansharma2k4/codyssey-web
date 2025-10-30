type PodiumItem = {
  team: string;
  image: string;
};

type PodiumProps = {
  topThree: [PodiumItem, PodiumItem, PodiumItem];
};

const Podium: React.FC<PodiumProps> = ({ topThree }) => {
  if (!topThree || topThree.length < 3) {
    return <div>Loading podium...</div>;
  }

  const [first, second, third] = topThree;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="relative pt-[30%] ">
        <div className="absolute inset-0">
          <div className="absolute w-[26%] -top-4 left-1/2 -translate-x-1/2">
            <TeamDisplay team={first.team} image={first.image} isFirstPlace />
          </div>

          <div className="absolute w-[22%] top-[27%] left-[17%] -translate-x-1/2">
            <TeamDisplay team={second.team} image={second.image} />
          </div>

          <div className="absolute w-[22%] top-[30%] right-[17%] translate-x-1/2">
            <TeamDisplay team={third.team} image={third.image} />
          </div>
        </div>

        <img
          src="/leaderboard/podium.png"
          alt="Leaderboard Podium"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

type TeamDisplayProps = {
  team: string;
  image: string;
  isFirstPlace?: boolean;
};

const TeamDisplay: React.FC<TeamDisplayProps> = ({
  team,
  image,
  isFirstPlace = false,
}) => {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex flex-col items-start">
        {isFirstPlace && (
          <div
            className="text-4xl sm:text-5xl -rotate-45 translate-y-5 "
            style={{ marginTop: "-1rem" }}
          >
            👑
          </div>
        )}

        <img
          src={image}
          alt={`${team} logo`}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <h3 className="font-bold text-white text-sm sm:text-xl md:text-2xl text-center whitespace-nowrap drop-shadow-md">
        {team}
      </h3>
    </div>
  );
};

export default Podium;
