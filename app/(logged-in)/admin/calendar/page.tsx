import IntegrationForm from "@/components/admin/google-calendar-page/IntegrationForm";
import ServiceEmail from "@/components/admin/google-calendar-page/ServiceEmail";
import Image from "next/image";
import SharingDemo from "@/lib/images/calendar-share.jpeg";
import IdDemo from "@/lib/images/calendar-id.jpeg";

// export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="bg-background">
      <div className="container">
        <div className="flex flex-col py-10">
          <h1 className="text-center text-2xl font-bold">
            Integracja kalendarza Google
          </h1>

          <p className="py-4 text-foreground">
            Aby dodać synchronizację między kalendarze google i aplikacją:
          </p>
          <div className="flex flex-col gap-10 pt-4">
            <div>
              <p className="text-foreground">
                1. Udostępnij kalendarz poniższemu kontu i przyznaj mu
                uprawnienia &quot;może zmieniać wydarzenia oraz zarządzać
                udostępnianiem&quot;
              </p>
              <ServiceEmail />
              <Image
                alt=""
                src={SharingDemo}
                className="my-4 rounded-xl border shadow-md"
              />
            </div>
            <div>
              <p className="pt-6 text-foreground">
                2. Skopiuj do pola poniżej identyfikator kalendarza.
              </p>
              <Image
                alt=""
                src={IdDemo}
                className="my-4 rounded-xl border shadow-md"
              />
            </div>
          </div>
          <IntegrationForm />
        </div>
      </div>
    </main>
  );
}
