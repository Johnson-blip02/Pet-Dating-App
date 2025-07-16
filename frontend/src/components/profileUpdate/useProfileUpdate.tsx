import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PetProfile } from "../../types/petProfile";

export function useProfileUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<PetProfile>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    fetch(`${apiUrl}/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setPhotoPreview(data.photoUrl || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);

    try {
      await fetch(`${apiUrl}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (photoFile) {
        const form = new FormData();
        form.append("file", photoFile);

        const uploadRes = await fetch(
          `${apiUrl}/image/update?oldPath=${formData.photoPath || ""}`,
          {
            method: "PUT",
            body: form,
          }
        );

        if (!uploadRes.ok) throw new Error("Photo upload failed");
        const result = await uploadRes.json();

        await fetch(`${apiUrl}/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, photoPath: result.path }),
        });
      }

      alert("Profile updated successfully!");
      navigate("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    photoPreview,
    handleChange,
    handleFileChange,
    handleSubmit,
    loading,
    isSubmitting,
  };
}
