import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function Explore() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold">Explore Matches</h1>
        <p>Swipe through pets in your area.</p>
      </main>
      <Footer />
    </div>
  );
}
