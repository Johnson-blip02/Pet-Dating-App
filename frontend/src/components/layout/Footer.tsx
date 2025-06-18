export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} PetMatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
