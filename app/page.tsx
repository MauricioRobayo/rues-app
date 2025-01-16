export default function Home() {
  return (
    <main>
      <div>
        <form>
          <label htmlFor="q">Buscar empresa</label>
          <input type="text" id="q" name="q" />
          <button type="submit">Buscar</button>
        </form>
      </div>
    </main>
  );
}
