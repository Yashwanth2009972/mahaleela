"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff } from "lucide-react";

interface CollectionActionButtonsProps {
  collectionId: string;
  isPublished: boolean;
}

export const CollectionActionButtons: React.FC<CollectionActionButtonsProps> = ({
  collectionId,
  isPublished,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/collections/${collectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      router.refresh();
    } catch {
      alert("Failed to update collection status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this collection?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/collections/${collectionId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch {
      alert("Failed to delete collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={handleTogglePublish}
        disabled={loading}
        title={isPublished ? "Unpublish" : "Publish"}
        className="p-1.5 border border-gold/30 hover:border-gold text-gold hover:bg-cream transition-colors"
      >
        {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        title="Delete"
        className="p-1.5 border border-gold/30 hover:border-gold text-gold hover:bg-cream transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
