import { CharacterCreationForm } from "./components/CharacterCreationForm";

export default function Home() {
  return (
    <main className="min-h-screen h-auto flex items-start justify-start py-8 bg-gray-900">
      <CharacterCreationForm />
    </main>
  );
}
