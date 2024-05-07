import { RecentSearchesCard } from "@/components/pages/hotels/ui/RecentSearchesCard";
export function RecentSearches() {
  const recentSearches = [];
  recentSearches.length = Math.floor(Math.random() * 2);
  return (
    <section className="mb-[80px]">
      <div className="mb-[32px] text-[2rem] font-semibold text-secondary">
        Your recent searches
      </div>

      {recentSearches.length === 0 ? (
        <div className="select-none text-center opacity-50">
          No recent searches
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px]">
          <RecentSearchesCard />
          <RecentSearchesCard />
          <RecentSearchesCard />
          <RecentSearchesCard />
          <RecentSearchesCard />
        </div>
      )}
    </section>
  );
}
