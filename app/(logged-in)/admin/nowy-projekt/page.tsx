"use client";

export default function Profile() {
  return (
    <main className="grid place-content-center">
      <h1>this is only for admins</h1>
      <form method="post" action="/api/project" className="flex flex-col">
        <label>Nazwa projektu</label>
        <input type="text" name="name" />
        <label>Opis do kalendarza</label>
        <textarea name="calendarDescription"></textarea>
        <label>Gdzie</label>
        <input type="text" name="location" />
        <input type="date" name="start" min="2023-09-17" />
        <button>spróbuj dodać event do kalendarza</button>
      </form>
    </main>
  );
}
