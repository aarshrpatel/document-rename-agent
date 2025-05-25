"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [classification, setClassification] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    try {
      setStatus("Uploading...");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setFilename(data.filename);

      setStatus("Classifying...");
      const classifyRes = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: data.filename }),
      });
      const classifyData = await classifyRes.json();
      setClassification(classifyData.classification);

      setStatus("Getting suggestions...");
      const suggestRes = await fetch("http://127.0.0.1:8000/suggest-filenames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: data.filename }),
      });
      const suggestData = await suggestRes.json();
      setSuggestions(suggestData.suggestions ?? []); // ✅ fallback to empty array

      setStatus("");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Something went wrong.");
    }
  }

  async function handleRename(newName: string) {
    try {
      setStatus("Renaming...");
      await fetch("http://127.0.0.1:8000/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_name: filename, new_name: newName }),
      });
      setSelected(newName);
      setStatus("Renamed!");
    } catch (error) {
      console.error("Rename error:", error);
      setStatus("Rename failed.");
    }
  }

  return (
    <main className="flex flex-col items-center gap-6 p-8">
      <form onSubmit={handleUpload} className="flex flex-col gap-4 items-center">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Upload & Classify
        </button>
      </form>

      {status && <div>{status}</div>}
      {classification && (
        <div>
          Classification: <b>{classification}</b>
        </div>
      )}
      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <div>
          <h3 className="font-bold">Suggested Filenames:</h3>
          <ul className="flex flex-col gap-2">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => handleRename(s)}
                  disabled={!!selected}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selected && (
        <div className="text-green-700 flex flex-col items-center gap-2">
          <div>
            File renamed to: <b>{selected}</b>
          </div>
          <a
            href={`http://127.0.0.1:8000/download/${encodeURIComponent(selected)}`}
            className="px-3 py-1 bg-blue-700 text-white rounded"
            download
          >
            Download File
          </a>
        </div>
      )}
    </main>
  );
}
