
interface FeaturedEventsStatsProps {
  featuredCount: number;
  festivalCount: number;
  hiddenCount: number;
}

const FeaturedEventsStats = ({
  featuredCount,
  festivalCount,
  hiddenCount
}: FeaturedEventsStatsProps) => {
  return (
    <div className="text-gray-400 text-sm">
      <p>{featuredCount} events featured</p>
      <p>{festivalCount} events marked as festivals</p>
      <p>{hiddenCount} events hidden</p>
    </div>
  );
};

export default FeaturedEventsStats;
