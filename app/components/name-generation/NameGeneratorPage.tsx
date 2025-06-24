"use client";

import { StandaloneNameGenerator } from "@/app/components/name-generation/StandaloneNameGenerator";

export const NameGeneratorPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-100 mb-4">Name Generator</h1>
            <p className="text-zinc-400">
              Generate unique character names for your Tempest adventures
            </p>
          </div>
          
          <StandaloneNameGenerator />
        </div>
      </div>
    </div>
  );
}; 