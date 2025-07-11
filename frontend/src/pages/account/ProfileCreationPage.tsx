// src/pages/profile/ProfileCreationPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch to trigger actions
import { setPetProfileId } from "../../slices/authSlice"; // Import setPetProfileId action
import { getCookie, setCookie } from "../../utils/cookies";
import FeedbackMessage from "../../components/profileCreation/FeedbackMessage";
import FormInput from "../../components/profileCreation/FormInput";
import FormSelect from "../../components/profileCreation/FormSelect";
import ImageUploader from "../../components/profileCreation/ImageUploader";
import PreferencesCheckboxes from "../../components/profileCreation/PreferencesCheckboxes";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function ProfileCreationPage() {
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

  const [accountId, setAccountId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      petPreferences: checked
        ? [...prev.petPreferences, value]
        : prev.petPreferences.filter((pref) => pref !== value),
    }));
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
      setError("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");
    setSuccessMessage("");

    try {
      // Step 1: Create the pet profile
      const createRes = await fetch("http://localhost:5074/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create profile");
      }

      const newProfile = await createRes.json();

      // Step 2: Link the profile to the account
      const linkRes = await fetch(
        `http://localhost:5074/api/accounts/${accountId}/link-profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ petProfileId: newProfile.id }),
        }
      );

      if (linkRes.ok) {
        // Success case - keep processing state during navigation
        setCookie("petProfileId", newProfile.id);
        setSuccessMessage("Pet profile created and linked!");

        // Dispatch to Redux
        dispatch(setPetProfileId(newProfile.id));

        setTimeout(() => navigate("/explore"), 1500); // Redirect to explore after success
      } else {
        // Link failed case
        throw new Error("Failed to link profile");
      }
    } catch (err) {
      // Error case - reset processing state
      console.error("Profile creation error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />
      <main className="max-w-xl mx-auto mt-10 p-8 rounded-lg shadow-lg w-full bg-white dark:bg-gray-900">
        <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
          Set Up Your Pet Profile
        </h2>

        {error && <FeedbackMessage type="error" message={error} />}
        {successMessage && (
          <FeedbackMessage type="success" message={successMessage} />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            id="userName"
            label="Pet Name"
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            required
          />

          <FormInput
            id="age"
            label="Age"
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
          />

          <FormSelect
            id="petType"
            label="Pet Type"
            name="petType"
            value={form.petType}
            onChange={handleChange}
            options={["Dog", "Cat"]}
            required
          />

          <PreferencesCheckboxes
            preferences={form.petPreferences}
            onChange={handleCheckboxChange}
          />

          <ImageUploader
            onUpload={handleImageUpload}
            previewUrl={form.photoPath}
          />

          <FormInput
            id="location"
            label="Location"
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black py-2 rounded hover:bg-yellow-500 dark:hover:bg-yellow-600 transition disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? "Creating Profile..." : "Submit"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
