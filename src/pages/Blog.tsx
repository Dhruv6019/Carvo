import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    Clock,
    User,
    ArrowRight,
    Search,
    TrendingUp,
    Wrench,
    Zap,
    Sparkles,
    Loader2
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useState, useEffect } from "react";

interface BlogArticle {
    id: number;
    title: string;
    description: string;
    cover_image: string;
    published_at: string;
    reading_time_minutes: number;
    user: {
        name: string;
        username: string;
    };
    tag_list: string[];
    url: string;
}

const Blog = () => {
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch articles from Dev.to API - using 'top' to get high-quality articles with images
            const response = await fetch(
                'https://dev.to/api/articles?top=7&per_page=30'
            );

            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }

            const data = await response.json();

            // Filter to prioritize articles with cover images
            const articlesWithImages = data.filter((article: BlogArticle) => article.cover_image);
            const articlesWithoutImages = data.filter((article: BlogArticle) => !article.cover_image);

            // Combine: articles with images first, then without
            setArticles([...articlesWithImages, ...articlesWithoutImages]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching articles:', err);

            // Fallback to general tech articles if automotive fails
            try {
                const fallbackResponse = await fetch(
                    'https://dev.to/api/articles?tag=technology&top=7&per_page=30'
                );
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    setArticles(fallbackData);
                    setError(null);
                }
            } catch (fallbackErr) {
                console.error('Fallback also failed:', fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const categories = [
        { name: "All Posts", value: "all", icon: Sparkles },
        { name: "Automotive", value: "automotive", icon: TrendingUp },
        { name: "Performance", value: "performance", icon: Zap },
        { name: "Technology", value: "technology", icon: Wrench },
    ];

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description?.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedCategory === "all") return matchesSearch;

        const matchesCategory = article.tag_list.some(tag =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase())
        );

        return matchesSearch && matchesCategory;
    });

    const featuredArticle = filteredArticles[0];
    const remainingArticles = filteredArticles.slice(1, 13);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <AnimatedSection className="pt-24 pb-16 bg-gradient-to-b from-muted to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge className="mb-6 text-base px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 border-0">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Live Articles from Dev.to
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            Stories, Tips & <span className="text-gradient bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 bg-clip-text text-transparent">Inspiration</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                            Real-time articles about automotive technology, customization trends, and industry insights.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-orange-500"
                                />
                            </div>
                            {/* Search Results Counter */}
                            {!loading && (searchQuery || selectedCategory !== "all") && (
                                <p className="text-sm text-muted-foreground text-center">
                                    Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                                    {searchQuery && ` matching "${searchQuery}"`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Categories */}
            <section className="py-8 bg-muted/50 border-y">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category, index) => (
                            <Button
                                key={index}
                                variant={selectedCategory === category.value ? "default" : "outline"}
                                className={`flex items-center gap-2 ${selectedCategory === category.value ? 'bg-gradient-to-r from-orange-500 to-red-600' : ''}`}
                                onClick={() => setSelectedCategory(category.value)}
                            >
                                <category.icon className="w-4 h-4" />
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Loading State */}
            {loading && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
                        <p className="text-xl text-muted-foreground">Loading articles...</p>
                    </div>
                </section>
            )}

            {/* Error State */}
            {error && !loading && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xl text-red-500 mb-4">Failed to load articles</p>
                        <Button onClick={fetchArticles} className="bg-gradient-to-r from-orange-500 to-red-600">
                            Try Again
                        </Button>
                    </div>
                </section>
            )}

            {/* Featured Post */}
            {!loading && featuredArticle && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-display font-bold mb-2">Featured Article</h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                        </div>

                        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-500/50">
                            <div className="grid lg:grid-cols-2 gap-0">
                                <div className="relative h-64 lg:h-auto">
                                    <img
                                        src={featuredArticle.cover_image || "/placeholder.svg"}
                                        alt={featuredArticle.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop";
                                        }}
                                    />
                                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-600 border-0">
                                        Featured
                                    </Badge>
                                </div>
                                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                                    {featuredArticle.tag_list[0] && (
                                        <Badge variant="secondary" className="w-fit mb-4 capitalize">
                                            {featuredArticle.tag_list[0]}
                                        </Badge>
                                    )}
                                    <h3 className="text-3xl font-display font-bold mb-4 hover:text-orange-600 transition-colors line-clamp-2">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed line-clamp-3">
                                        {featuredArticle.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {featuredArticle.user.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(featuredArticle.published_at)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {featuredArticle.reading_time_minutes} min read
                                        </div>
                                    </div>
                                    <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer">
                                        <Button className="bg-gradient-to-r from-orange-500 to-red-600 w-fit">
                                            Read Article
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </a>
                                </CardContent>
                            </div>
                        </Card>
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            {!loading && remainingArticles.length > 0 && (
                <section className="py-16 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-display font-bold mb-2">Latest Articles</h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {remainingArticles.map((post) => (
                                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="relative h-48 overflow-hidden bg-muted">
                                            <img
                                                src={post.cover_image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop"}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop";
                                                }}
                                            />
                                            {post.tag_list[0] && (
                                                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground border capitalize">
                                                    {post.tag_list[0]}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                                                {post.description || "Read more to discover the full article..."}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {post.user.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(post.published_at)}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-orange-600 hover:bg-transparent group-hover:translate-x-2 transition-transform">
                                                Read More
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </CardContent>
                                    </a>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* No Results */}
            {!loading && filteredArticles.length === 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xl text-muted-foreground mb-4">No articles found matching your criteria</p>
                        <Button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                            }}
                            variant="outline"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </section>
            )}

            {/* Newsletter CTA */}
            <section className="py-16 bg-gradient-to-r from-orange-500/10 via-red-600/10 to-pink-600/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                        Stay Updated
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Get the latest automotive articles and insights delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1"
                        />
                        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
