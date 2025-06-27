import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCookie } from "../../utils/cookies";

export default function ProfileCreation() {
  type PetProfileForm = {
    userName: string;
    age: string;
    petType: string;
    petPreferences: string[];
    photoPath: string;
    location: string;
  };

  const [form, setForm] = useState<PetProfileForm>({
    userName: "",
    age: "",
    petType: "",
    petPreferences: [],
    photoPath: "",
    location: "",
  });

  const [accountId, setAccountId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cookieId = getCookie("accountId");
    if (cookieId) {
      setAccountId(cookieId);
    } else {
      alert("No account ID found. Please sign up or log in.");
      navigate("/signup");
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm((prev) => ({ ...prev, petPreferences: selected }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5074/api/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((prev) => ({ ...prev, photoPath: data.path }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const createRes = await fetch("http://localhost:5074/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const newProfile = await createRes.json();

    await fetch(
      `http://localhost:5074/api/accounts/${accountId}/link-profile`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petProfileId: newProfile.id }),
      }
    );

    alert("Pet profile created and linked!");
    navigate("/explore");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Set Up Your Pet Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="text"
            name="userName"
            placeholder="Pet Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <input
            required
            type="number"
            name="age"
            placeholder="Age"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <select
            required
            name="petType"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Select Pet Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
          <select
            multiple
            name="petPreferences"
            className="w-full border p-2 rounded"
            onChange={handlePreferencesChange}
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
          </select>

          <input
            required
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={handleImageUpload}
          />

          <input
            required
            type="text"
            name="location"
            placeholder="Location"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
