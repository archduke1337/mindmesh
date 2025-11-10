'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isUserAdminByEmail } from "@/lib/adminConfig";
import { galleryService, type GalleryImage } from "@/lib/database";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/modal";

type GalleryCategory = "events" | "workshops" | "hackathons" | "team" | "projects";

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  category: GalleryCategory;
  date: string;
  attendees: number;
  tags: string;
}

const CATEGORIES: { key: GalleryCategory; label: string; icon: string }[] = [
  { key: "events", label: "Events", icon: "🎉" },
  { key: "workshops", label: "Workshops", icon: "🛠️" },
  { key: "hackathons", label: "Hackathons", icon: "💻" },
  { key: "team", label: "Team", icon: "👥" },
  { key: "projects", label: "Projects", icon: "🚀" },
];

export default function AdminGalleryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    imageUrl: "",
    category: "events",
    date: new Date().toISOString().split("T")[0],
    attendees: 0,
    tags: "",
  });

  useEffect(() => {
    if (!authLoading && user && isUserAdminByEmail(user.email)) {
      fetchImages();
    }
  }, [authLoading, user]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryService.getAllImages();
      setImages(data);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);

      if (!formData.title || !formData.imageUrl || !formData.date) {
        setError("Please fill in all required fields");
        return;
      }

      if (!user?.email) {
        setError("User email not found");
        return;
      }

      const imageData = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        category: formData.category,
        date: formData.date,
        attendees: formData.attendees,
        uploadedBy: user.email,
        isApproved: true,
        isFeatured: false,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      };

      if (editingId) {
        await galleryService.updateImage(editingId, imageData);
      } else {
        await galleryService.createImage(imageData);
      }

      await fetchImages();
      resetForm();
      onOpenChange();
    } catch (err) {
      console.error("Error saving image:", err);
      setError("Failed to save image");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "events",
      date: new Date().toISOString().split("T")[0],
      attendees: 0,
      tags: "",
    });
    setEditingId(null);
  };

  const handleEdit = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      description: image.description,
      imageUrl: image.imageUrl,
      category: image.category,
      date: image.date,
      attendees: image.attendees,
      tags: image.tags?.join(", ") || "",
    });
    setEditingId(image.$id || null);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    try {
      await galleryService.deleteImage(id);
      await fetchImages();
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image");
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await galleryService.toggleFeatured(id, !currentStatus);
      await fetchImages();
    } catch (err) {
      console.error("Error toggling featured:", err);
      setError("Failed to update image");
    }
  };

  return (
    <AdminPageWrapper title="Gallery Management" description="Manage and organize gallery images">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📸 Gallery Management</h1>
            <p className="text-default-600 mt-2">Manage and organize gallery images</p>
          </div>
          <Button
            color="primary"
            onPress={() => {
              resetForm();
              onOpen();
            }}
            size="lg"
          >
            + Upload Image
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-none bg-red-50 dark:bg-red-950/30">
            <CardBody className="text-red-600 dark:text-red-400">{error}</CardBody>
          </Card>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner label="Loading gallery images..." size="lg" />
          </div>
        ) : images.length === 0 ? (
          <Card className="border-none">
            <CardBody className="p-12 text-center">
              <p className="text-4xl mb-4">📸</p>
              <h3 className="text-xl font-semibold mb-2">No images yet</h3>
              <p className="text-default-600 mb-6">Start building your gallery by uploading images</p>
              <Button
                color="primary"
                onPress={() => {
                  resetForm();
                  onOpen();
                }}
              >
                Upload First Image
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none">
                <CardBody className="p-6 text-center">
                  <p className="text-2xl font-bold text-primary">{images.length}</p>
                  <p className="text-default-600 text-sm">Total Images</p>
                </CardBody>
              </Card>
              <Card className="border-none">
                <CardBody className="p-6 text-center">
                  <p className="text-2xl font-bold text-success">{images.filter((i) => i.isApproved).length}</p>
                  <p className="text-default-600 text-sm">Approved</p>
                </CardBody>
              </Card>
              <Card className="border-none">
                <CardBody className="p-6 text-center">
                  <p className="text-2xl font-bold text-warning">{images.filter((i) => !i.isApproved).length}</p>
                  <p className="text-default-600 text-sm">Pending</p>
                </CardBody>
              </Card>
              <Card className="border-none">
                <CardBody className="p-6 text-center">
                  <p className="text-2xl font-bold text-secondary">{images.filter((i) => i.isFeatured).length}</p>
                  <p className="text-default-600 text-sm">Featured</p>
                </CardBody>
              </Card>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.$id} className="border-none">
                  <CardBody className="p-0 overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      {image.isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          ⭐ Featured
                        </div>
                      )}
                      {!image.isApproved && (
                        <div className="absolute top-2 left-2 bg-warning text-white px-2 py-1 rounded text-xs font-semibold">
                          ⏳ Pending
                        </div>
                      )}
                    </div>
                  </CardBody>
                  <CardFooter className="flex-col items-start gap-2 p-4">
                    <div className="w-full">
                      <h3 className="font-semibold truncate">{image.title}</h3>
                      <p className="text-xs text-default-500">{image.date}</p>
                    </div>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="secondary"
                      startContent={<span>👥</span>}
                    >
                      {image.attendees}
                    </Chip>
                    <Chip
                      size="sm"
                      variant="bordered"
                      startContent={
                        <span>
                          {CATEGORIES.find((c) => c.key === image.category)?.icon}
                        </span>
                      }
                    >
                      {CATEGORIES.find((c) => c.key === image.category)?.label}
                    </Chip>
                    <div className="flex gap-2 w-full pt-2">
                      <Button
                        size="sm"
                        variant="flat"
                        className="flex-1"
                        onPress={() => handleEdit(image)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color={image.isFeatured ? "warning" : "default"}
                        onPress={() =>
                          handleToggleFeatured(image.$id || "", image.isFeatured)
                        }
                      >
                        {image.isFeatured ? "⭐" : "☆"}
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(image.$id || "")}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Upload/Edit Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editingId ? "Edit Gallery Image" : "Upload New Image"}
                </ModalHeader>
                <ModalBody className="space-y-4">
                  <Input
                    label="Title *"
                    placeholder="e.g., Tech Summit 2024"
                    value={formData.title}
                    onValueChange={(value) =>
                      handleInputChange("title", value)
                    }
                  />

                  <Textarea
                    label="Description"
                    placeholder="Add a description for this image"
                    value={formData.description}
                    onValueChange={(value) =>
                      handleInputChange("description", value)
                    }
                  />

                  <Input
                    label="Image URL *"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onValueChange={(value) =>
                      handleInputChange("imageUrl", value)
                    }
                  />

                  <Select
                    label="Category *"
                    selectedKeys={[formData.category]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as GalleryCategory;
                      handleInputChange("category", key);
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.key}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Date *"
                    type="date"
                    value={formData.date}
                    onValueChange={(value) =>
                      handleInputChange("date", value)
                    }
                  />

                  <Input
                    label="Number of Attendees"
                    type="number"
                    placeholder="0"
                    value={formData.attendees.toString()}
                    onValueChange={(value) =>
                      handleInputChange("attendees", parseInt(value) || 0)
                    }
                  />

                  <Input
                    label="Tags"
                    placeholder="tag1, tag2, tag3"
                    value={formData.tags}
                    onValueChange={(value) =>
                      handleInputChange("tags", value)
                    }
                  />

                  {error && (
                    <Card className="border-none bg-red-50 dark:bg-red-950/30">
                      <CardBody className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </CardBody>
                    </Card>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    {editingId ? "Update" : "Upload"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </AdminPageWrapper>
  );
}
