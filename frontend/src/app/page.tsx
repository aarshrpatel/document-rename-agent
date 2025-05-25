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
    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
 
    // Upload file
    const res = await fetch("https://effective-space-acorn-r4gwr7rq95gw35jww-8000.app.github.dev/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setFilename(data.filename);

    setStatus("Classifying...");
    // Classify
    const classifyRes = await fetch("https://effective-space-acorn-r4gwr7rq95gw35jww-8000.app.github.dev/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: data.filename }),
    });
    const classifyData = await classifyRes.json();
    setClassification(classifyData.classification);

    setStatus("Getting suggestions...");
    // Get suggestions
    const suggestRes = await fetch("https://effective-space-acorn-r4gwr7rq95gw35jww-8000.app.github.dev/suggest-filenames", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: data.filename }),
    });
    const suggestData = await suggestRes.json();
    setSuggestions(suggestData.suggestions);
    setStatus("");
  }

  async function handleRename(newName: string) {
    setStatus("Renaming...");
    await fetch("https://effective-space-acorn-r4gwr7rq95gw35jww-8000.app.github.dev/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_name: filename, new_name: newName }),
    });
    setSelected(newName);
    setStatus("Renamed!");
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
      {classification && <div>Classification: <b>{classification}</b></div>}
      {suggestions.length > 0 && (
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
      {selected && <div className="text-green-700">File renamed to: <b>{selected}</b></div>}
    </main>
  );
}