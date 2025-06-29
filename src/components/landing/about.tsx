
export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">About McDelta SMP</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              McDelta SMP is not just another Minecraft server. We are a community-driven Lifesteal SMP where strategy, skill, and alliances determine your fate. Our server is built on providing a challenging yet fair gameplay experience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With custom features, regular events, and an active player base, there's always something new to discover. Whether you're a seasoned PvP veteran or a master builder, you'll find your place in the world of McDelta.
            </p>
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden group shadow-2xl shadow-primary/20 transition-all duration-300 ease-in-out hover:shadow-primary/40 hover:shadow-2xl hover:scale-105">
            <img
              src="https://placehold.co/800x800.png"
              alt="McDelta SMP promotional image featuring a character in a Minecraft world"
              data-ai-hint="minecraft character"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
