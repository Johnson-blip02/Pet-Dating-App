import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProfileForm from "../../components/profileUpdate/ProfileForm";
import { useProfileUpdate } from "../../components/profileUpdate/useProfileUpdate";

export default function ProfileUpdatePage() {
  const {
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
    photoPreview,
    isSubmitting,
    loading,
  } = useProfileUpdate();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-muted dark:bg-dark-muted py-8 px-4 text-light-text dark:text-dark-text">
        <div className="max-w-md mx-auto bg-light-background dark:bg-dark-background p-6 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-4">
            Update Pet Profile
          </h2>
          <ProfileForm
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            photoPreview={photoPreview}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
