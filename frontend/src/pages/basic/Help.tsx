import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Frequently Asked Questions
          </h2>
          <ul className="space-y-4">
            <li>
              <p className="font-medium">How do I reset my password?</p>
              <p className="text-gray-700">
                Go to the login page and click “Forgot password?” to receive a
                reset link.
              </p>
            </li>
            <li>
              <p className="font-medium">How do I contact support?</p>
              <p className="text-gray-700">
                Email us at{" "}
                <a
                  href="mailto:support@petmatch.com"
                  className="text-blue-600 underline"
                >
                  support@petmatch.com
                </a>
                .
              </p>
            </li>
            <li>
              <p className="font-medium">Why can't I see any matches?</p>
              <p className="text-gray-700">
                Try updating your location settings and make sure your profile
                is complete.
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
          <p className="text-gray-700">
            If you couldn’t find the answer you were looking for, reach out to
            us anytime at{" "}
            <a
              href="mailto:support@petmatch.com"
              className="text-blue-600 underline"
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
