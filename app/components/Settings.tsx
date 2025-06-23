"use client";

export const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-8">Settings</h1>
          
          <div className="space-y-8">
            {/* General Settings */}
            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">General</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-100 font-medium">Theme</h3>
                    <p className="text-zinc-400 text-sm">Choose your preferred color scheme</p>
                  </div>
                  <select className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-zinc-100">
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-100 font-medium">Auto-save</h3>
                    <p className="text-zinc-400 text-sm">Automatically save character changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Character Settings */}
            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">Character Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-100 font-medium">Default attributes</h3>
                    <p className="text-zinc-400 text-sm">Choose the default attribute assignment method</p>
                  </div>
                  <select className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-zinc-100">
                    <option value="standard">Standard Array</option>
                    <option value="random">Random Roll</option>
                    <option value="point-buy">Point Buy</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-100 font-medium">Show advanced options</h3>
                    <p className="text-zinc-400 text-sm">Display additional character creation options</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">Data Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-100 font-medium">Export characters</h3>
                    <p className="text-zinc-400 text-sm">Download your characters as a JSON file</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Export
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-100 font-medium">Import characters</h3>
                    <p className="text-zinc-400 text-sm">Import characters from a JSON file</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                    Import
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-100 font-medium">Clear all data</h3>
                    <p className="text-zinc-400 text-sm">Delete all saved characters and settings</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">About</h2>
              <div className="space-y-2 text-zinc-400">
                <p><strong>Tempest 2 Character Creator</strong></p>
                <p>Version 1.0.0</p>
                <p>A tool for creating and managing characters for the Tempest 2 tabletop roleplaying game.</p>
                <p className="text-sm text-zinc-500 mt-4">
                  Built with Next.js, React, and Tailwind CSS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 