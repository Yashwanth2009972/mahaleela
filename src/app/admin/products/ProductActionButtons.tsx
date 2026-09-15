"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff, Archive } from "lucide-react";

interface ProductActionButtonsProps {
  productId: string;
  isPublished: boolean;
  isArchived: boolean;
}

export const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  productId,
  isPublished,
  isArchived,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      router.refresh();
    } catch {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleArchive = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !isArchived }),
      });
      router.refresh();
    } catch {
      alert("Failed to update archive status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch {
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
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
        onClick={handleToggleArchive}
        disabled={loading}
        title={isArchived ? "Unarchive" : "Archive"}
        className="p-1.5 border border-gold/30 hover:border-gold text-gold hover:bg-cream transition-colors"
      >
        <Archive className="w-3.5 h-3.5" />
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
