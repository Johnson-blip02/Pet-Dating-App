import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />
      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Frequently Asked Questions
          </h2>
          <ul className="space-y-4">
            <li>
              <p className="font-medium">How do I connect with other pets?</p>
              <p>
                Go to the login page and sign in, once completed click on the
                explore in header.
              </p>
            </li>
            <li>
              <p className="font-medium">How do I contact support?</p>
              <p>
                Email us at{" "}
                <a
                  href="mailto:support@petmatch.com"
                  className="text-light-accent dark:text-dark-accent underline"
                >
                  support@petmatch.com
                </a>
                .
              </p>
            </li>
            <li>
              <p className="font-medium">Why can't I see any matches?</p>
              <p>
                Try updating your location settings and make sure your profile
                is complete.
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
          <p>
            If you couldn’t find the answer you were looking for, reach out to
            us anytime at{" "}
            <a
              href="mailto:support@petmatch.com"
              className="text-light-accent dark:text-dark-accent underline"
            >
              support@petmatch.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
