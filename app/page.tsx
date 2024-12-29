import { SearchResults } from "@/app/SearchResults";

export default async function Home() {
  return (
    <main>
      <div>
        <form>
          <label htmlFor="q">Buscar empresa</label>
          <input type="text" id="q" name="q" />
          <button type="submit">Buscar</button>
        </form>
        <SearchResults />
      </div>
    </main>
  );
}