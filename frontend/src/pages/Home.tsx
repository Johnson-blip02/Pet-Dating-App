import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-6">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-4">
          🐾 Tailwind is Working!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Your pet social app is ready to roll.
        </p>
      </div>
      <Footer />
    </>
  );
}
