"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles, 
  Edit3,
  Layers
} from "lucide-react";

interface HomepageSection {
  id: string;
  sectionType: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  isVisible: boolean;
  sortOrder: number;
}

interface HomepageBuilderProps {
  initialSections: HomepageSection[];
}

export const HomepageBuilderClient: React.FC<HomepageBuilderProps> = ({ initialSections }) => {
  const router = useRouter();
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update sortOrder values
    const updated = newSections.map((sec, idx) => ({ ...sec, sortOrder: idx + 1 }));
    setSections(updated);

    // Save changes to API
    for (const s of updated) {
      await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, sortOrder: s.sortOrder }),
      });
    }
    setFeedback("SECTION ORDER UPDATED.");
    setTimeout(() => setFeedback(""), 3000);
    router.refresh();
  };

  const handleToggleVisibility = async (sec: HomepageSection) => {
    const updatedVisibility = !sec.isVisible;
    setSections((prev) =>
      prev.map((s) => (s.id === sec.id ? { ...s, isVisible: updatedVisibility } : s))
    );

    await fetch("/api/admin/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sec.id, isVisible: updatedVisibility }),
    });

    setFeedback(`SECTION ${sec.sectionType} ${updatedVisibility ? "VISIBLE" : "HIDDEN"}.`);
    setTimeout(() => setFeedback(""), 3000);
    router.refresh();
  };

  const startEdit = (sec: HomepageSection) => {
    setEditingId(sec.id);
    setEditTitle(sec.title || "");
    setEditSubtitle(sec.subtitle || "");
  };

  const saveEdit = async (sec: HomepageSection) => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sec.id,
          title: editTitle,
          subtitle: editSubtitle,
        }),
      });

      setSections((prev) =>
        prev.map((s) => (s.id === sec.id ? { ...s, title: editTitle, subtitle: editSubtitle } : s))
      );
      setEditingId(null);
      setFeedback("SECTION HEADLINES SAVED.");
      setTimeout(() => setFeedback(""), 3000);
      router.refresh();
    } catch {
      alert("Failed to save section changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3 border border-gold bg-cream text-xs uppercase tracking-luxury text-gold font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="border border-gold/30 bg-white p-6 shadow-sm divide-y divide-gold/20">
        {sections.map((sec, index) => {
          const isEditing = editingId === sec.id;

          return (
            <div
              key={sec.id}
              className={`py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                !sec.isVisible ? "opacity-60 bg-cream/20" : ""
              }`}
            >
              {/* Left: Position & Section Info */}
              <div className="flex items-start gap-4 flex-1">
                <span className="font-serif text-gold/60 text-sm font-bold pt-1">
                  #{String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-gold uppercase tracking-wider">
                      {sec.sectionType.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`px-2 py-0.5 border text-[8px] uppercase tracking-wider font-semibold ${
                        sec.isVisible
                          ? "border-gold bg-cream text-gold"
                          : "border-gold/30 text-gold/50"
                      }`}
                    >
                      {sec.isVisible ? "VISIBLE ON STOREFRONT" : "HIDDEN"}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="mt-3 space-y-2 max-w-lg">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="SECTION TITLE"
                        className="w-full px-3 py-1.5 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editSubtitle}
                        onChange={(e) => setEditSubtitle(e.target.value)}
                        placeholder="SECTION SUBTITLE / TAGLINE"
                        className="w-full px-3 py-1.5 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => saveEdit(sec)}
                          className="px-4 py-1.5 border border-gold bg-gold text-white text-[10px] uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
                        >
                          SAVE
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 border border-gold bg-white text-gold text-[10px] uppercase tracking-luxury hover:bg-cream"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-gold/80 uppercase tracking-luxury font-light">
                      <p className="font-medium text-gold">{sec.title || "Default Title"}</p>
                      {sec.subtitle && <p className="text-[10px] text-gold/60">{sec.subtitle}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Controls (Move Up/Down, Visibility, Edit) */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
                <button
                  type="button"
                  onClick={() => startEdit(sec)}
                  className="p-2 border border-gold/30 hover:border-gold text-gold hover:bg-cream transition-colors text-xs flex items-center gap-1"
                  title="Edit Headline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider hidden sm:inline">EDIT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleVisibility(sec)}
                  className="p-2 border border-gold/30 hover:border-gold text-gold hover:bg-cream transition-colors"
                  title={sec.isVisible ? "Hide section" : "Show section"}
                >
                  {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  className={`p-2 border transition-colors ${
                    index === 0
                      ? "border-gold/20 text-gold/30 cursor-not-allowed"
                      : "border-gold/30 hover:border-gold text-gold hover:bg-cream"
                  }`}
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => handleMove(index, "down")}
                  className={`p-2 border transition-colors ${
                    index === sections.length - 1
                      ? "border-gold/20 text-gold/30 cursor-not-allowed"
                      : "border-gold/30 hover:border-gold text-gold hover:bg-cream"
                  }`}
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
