import Image from "next/image";
import Nav from "./ui/NavBar/Nav";
import Hero from "./ui/Hero/Hero";
export default function Home() {
  return (
    <div className="bg-gray-300 min-h-full">
      <main className="flex flex-col w-full gap-[32px] row-start-2 items-center sm:items-start">
        
        <Hero />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
