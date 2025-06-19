# Tempest Character Creator

A modern, interactive character creation tool for the Tempest tabletop roleplaying game. Built with Next.js and React, this application provides an intuitive step-by-step character creation process with real-time stat calculations and character management.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Multi-Stage Character Creation**: Guided 8-stage character creation process
- **Real-Time Stat Calculations**: Automatic computation of derived stats based on attributes and ancestry
- **Character Management**: Save, load, and manage multiple characters locally
- **Rich Data Integration**: Comprehensive ancestries, backgrounds, skills, abilities, and spells
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Local Storage**: Characters persist between sessions using browser storage
- **Character Notes**: Add and save notes for each character

## 🎯 Character Creation Stages

1. **Attributes** - Assign STR, AGL, MND, VIG using standard or random methods
2. **Ancestry** - Choose from 10 unique ancestries (Azure Elf, Amber Elf, Dwarf, Poliwok, Felesian, Goliath, Gnome, Human, Pluma, Orc)
3. **Background** - Select from 40+ backgrounds (Acrobat, Alchemist, Aristocrat, etc.)
4. **Skills** - Choose 5 skills including your background's automatic skill
5. **Kit** - Select starting equipment and gear
6. **Abilities** - Choose from martial, nimble, musical, deadeye, and passive abilities
7. **Traits** - Select character traits and personality
8. **Summary** - Review and finalize your character

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dnsmith124/tempest-character-creator.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Turbopack for fast development builds

## 📁 Project Structure

```
tempest/
├── app/
│   ├── components/          # React components
│   │   ├── stages/         # Character creation stage components
│   │   └── ...             # Shared components
│   ├── data/               # Game data JSON files
│   │   ├── ancestries.json # Character ancestries
│   │   ├── backgrounds.json # Character backgrounds
│   │   ├── skills.json     # Available skills
│   │   ├── abilities-*.json # Different ability types
│   │   ├── spells-*.json   # Different spell schools
│   │   └── ...             # Other game data
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── public/                 # Static assets
└── ...                     # Configuration files
```

## 🎮 Game Data

The application includes comprehensive game data for the Tempest RPG:

- **10 Ancestries** with unique abilities and stat bonuses
- **40+ Backgrounds** with associated skills and starting benefits
- **Multiple Ability Types**: Martial, Nimble, Musical, Deadeye, and Passive
- **5 Spell Schools**: Arcane, Druidic, Fleuromancy, Holy, and Shadow
- **Extensive Skill System** with various categories
- **Character Traits** for personality customization

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- `CharacterCreationForm.tsx` - Main form orchestrator
- `stages/` - Individual stage components for each creation step
- `CurrentSelection.tsx` - Shows current character progress
- `SelectedCharacterDisplay.tsx` - Character viewer and manager

## 🎨 Customization

The application is designed to be easily customizable:

- **Game Data**: Modify JSON files in `app/data/` to add new ancestries, backgrounds, etc.
- **Styling**: Uses Tailwind CSS for easy theme customization
- **Components**: Modular design allows easy addition of new features

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Tempest tabletop roleplaying game
- Inspired by modern character creation tools
- Uses Next.js and React for optimal performance and developer experience

---

**Note**: This is a character creation tool for the Tempest RPG. For game rules and mechanics, please refer to the official Tempest rulebook.
