import { BRANDS, isBrandId } from "@/lib/brands";
import { syncPackages } from "@/server/sync";

const maxPagesPerQuery = process.env.SYNC_PAGES
  ? Number(process.env.SYNC_PAGES)
  : undefined;

const arg = process.env.SYNC_BRAND;
const brands = isBrandId(arg) ? [BRANDS[arg]] : Object.values(BRANDS);

const fetchVersions =
  process.env.SYNC_VERSIONS === "1"
    ? true
    : process.env.SYNC_VERSIONS === "0"
      ? false
      : undefined;

const run = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env before syncing.");
    process.exit(1);
  }
  let total = 0;
  for (const brand of brands) {
    console.log(`Syncing ${brand.language} packages from GitHub...`);
    const n = await syncPackages(brand, {
      maxPagesPerQuery,
      fetchVersions,
      onProgress: (msg) => console.log(`  ${msg}`),
    });
    console.log(`  ${brand.id}: upserted ${n} packages.`);
    total += n;
  }
  console.log(
    `Done. Upserted ${total} packages across ${brands.length} ecosystem(s).`,
  );
  process.exit(0);
};

run().catch((e) => {
  console.error("Sync failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
