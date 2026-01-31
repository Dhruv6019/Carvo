import { GlassCard } from "./ui/GlassCard";

export const ScrollingMarquee = () => {
    const projects = [
        { name: "Phantom Black M4", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop" },
        { name: "Acid Green GT3", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop" },
        { name: "Candy Red RS6", image: "https://images.unsplash.com/photo-1606152421633-874df1cf405e?w=400&h=300&fit=crop" },
        { name: "Satin Gray Sport", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop" },
        { name: "Midnight Purple GTR", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop" },
        { name: "Carbon Edition 911", image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf048?w=400&h=300&fit=crop" }
    ];

    // Multiply for seamless looping
    const displayProjects = [...projects, ...projects, ...projects];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-3xl md:text-6xl font-display font-black mb-6 leading-tight">
                    Masterpiece <span className="text-electric-blue">Creations</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    A scrolling gallery of our most ambitious transformations.
                    From subtle refinements to complete widebody overhauls.
                </p>
            </div>

            <div className="relative flex overflow-x-hidden">
                <div className="py-12 animate-marquee whitespace-nowrap flex items-center">
                    {displayProjects.map((project, idx) => (
                        <div key={idx} className="mx-6 flex-shrink-0 group relative cursor-pointer">
                            <GlassCard className="w-80 h-56 p-0 overflow-hidden border-white/10 group-hover:border-electric-blue/50 transition-all duration-500 shadow-2xl">
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                    <span className="text-white font-display font-bold text-lg">{project.name}</span>
                                </div>
                            </GlassCard>
                        </div>
                    ))}
                </div>

                {/* Second slider for seamless effect */}
                <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap flex items-center">
                    {displayProjects.map((project, idx) => (
                        <div key={idx} className="mx-6 flex-shrink-0 group relative cursor-pointer">
                            <GlassCard className="w-80 h-56 p-0 overflow-hidden border-white/10 group-hover:border-electric-blue/50 transition-all duration-500 shadow-2xl">
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                    <span className="text-white font-display font-bold text-lg">{project.name}</span>
                                </div>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </div>

            {/* Faded edges */}
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background via-background/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background via-background/50 to-transparent z-10 pointer-events-none"></div>
        </section>
    );
};
