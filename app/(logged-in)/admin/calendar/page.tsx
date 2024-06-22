import IntegrationForm from "@/components/admin/google-calendar-page/IntegrationForm";
import ServiceEmail from "@/components/admin/google-calendar-page/ServiceEmail";

// export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="bg-background">
      <div className="container">
        <div className="py-10">
          <h1 className="my-10 text-center text-2xl font-bold">
            Integracja kalendarza Google
          </h1>

          <p className="py-4 text-foreground">
            Aby dodać synchronizację między kalendarze google i aplikacją:
          </p>
          <p className="text-foreground">
            1. Udostępnij kalendarz poniższemu kontu i przyznaj mu uprawnienia
            &quot;może zmieniać wydarzenia&quot;
          </p>
          <ServiceEmail />
          <p className="pt-6 text-foreground">
            2. Skopiuj do pola poniżej identyfikator kalendarza
          </p>
          <IntegrationForm />
        </div>
      </div>
    </main>
  );
}
