import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <Header />

      <main className="flex-1 py-12 px-6 max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4">
            🐾 Welcome to PetMatch
          </h1>
          <p className="text-xl text-light-text/70 dark:text-dark-text/70 mb-8">
            Find your pet's perfect playmate
          </p>
          <button className="bg-light-accent hover:bg-light-accent/80 text-light-text px-6 py-3 rounded-lg transition-colors dark:bg-dark-accent dark:hover:bg-dark-accent/80 dark:text-dark-text">
            Get Started
          </button>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: "Matches", desc: "Find compatible pets" },
            { title: "Messaging", desc: "Safe chat system" },
            { title: "Meetups", desc: "Arrange playdates" },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-stone-300 dark:bg-neutral-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-lg text-light-text dark:text-dark-text">
                {feature.title}
              </h3>
              <p className="text-light-text/70 dark:text-dark-text/70">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Testimonial */}
        <section className="bg-light-accent/20 dark:bg-dark-accent/20 rounded-xl p-8">
          <blockquote className="italic text-light-text dark:text-dark-text">
            "My dog found his best friend through PetMatch!"
          </blockquote>
        </section>
      </main>

      <Footer />
    </div>
  );
}
