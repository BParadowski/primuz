export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        You are logged in, congratulations{" "}
        <form method="post">
          <button formAction="/auth/logout">Log out</button>
        </form>
      </header>
      {children}
      <footer>Nothing to see here</footer>
    </>
  );
}
