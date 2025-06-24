"use client";
export type NavigationTab = 'characters' | 'name-generator' | 'creatures' | 'settings';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  characterCount: number;
}

export const Navigation = ({ activeTab, onTabChange, characterCount }: NavigationProps) => {
  return (
    <nav className="bg-zinc-800 border-b border-zinc-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-zinc-100">Tempest</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('characters')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'characters'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              Characters
              {characterCount > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {characterCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => onTabChange('name-generator')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'name-generator'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              Name Generator
            </button>

            <button
              onClick={() => onTabChange('creatures')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'creatures'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              Creatures
            </button>
            
            {/* <button
              onClick={() => onTabChange('settings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              Settings
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}; 