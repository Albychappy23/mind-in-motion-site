import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Brain, Phone, Book, Edit, Eye, Users, Heart, Bookmark, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Resource } from "@shared/schema";

const iconMap = {
  brain: Brain,
  phone: Phone,
  book: Book,
  edit: Edit,
  eye: Eye,
  users: Users,
};

const categoryColors = {
  mindfulness: "bg-blue-100 text-blue-800",
  crisis: "bg-red-100 text-red-800",
  education: "bg-green-100 text-green-800",
  tools: "bg-purple-100 text-purple-800",
};

export default function ResourcesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [likedResources, setLikedResources] = useState<Set<number>>(new Set());
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<number>>(new Set());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const likeMutation = useMutation({
    mutationFn: async ({ id, likes }: { id: number; likes: number }) => {
      const response = await apiRequest("POST", `/api/resources/${id}/like`, { likes });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
  });

  const filteredResources = resources.filter((resource: Resource) => {
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === "all" || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleLike = (resource: Resource) => {
    const isLiked = likedResources.has(resource.id);
    const newLikes = isLiked ? resource.likes - 1 : resource.likes + 1;
    
    setLikedResources(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(resource.id);
      } else {
        newSet.add(resource.id);
      }
      return newSet;
    });

    likeMutation.mutate({ id: resource.id, likes: newLikes });
    
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      variant: "default"
    });
  };

  const handleBookmark = (resource: Resource) => {
    const isBookmarked = bookmarkedResources.has(resource.id);
    
    setBookmarkedResources(prev => {
      const newSet = new Set(prev);
      if (isBookmarked) {
        newSet.delete(resource.id);
      } else {
        newSet.add(resource.id);
      }
      return newSet;
    });

    toast({
      title: isBookmarked ? "Removed bookmark" : "Bookmarked resource",
      variant: "default"
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <section id="resources" className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 md:mb-0">
          Mental Health Resources
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
              <SelectItem value="crisis">Crisis Support</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource: Resource) => {
            const IconComponent = iconMap[resource.icon as keyof typeof iconMap] || Brain;
            const isLiked = likedResources.has(resource.id);
            const isBookmarked = bookmarkedResources.has(resource.id);
            
            return (
              <Card key={resource.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{resource.title}</h3>
                        <Badge className={categoryColors[resource.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(resource.rating)}
                      </div>
                      <span className="text-sm text-slate-600">{resource.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <Button variant="link" className="text-primary hover:text-blue-700 p-0">
                      Learn More
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(resource)}
                        className={`p-1 ${isLiked ? "text-red-500" : "text-slate-400 hover:text-red-500"}`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(resource)}
                        className={`p-1 ${isBookmarked ? "text-blue-500" : "text-slate-400 hover:text-blue-500"}`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredResources.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-slate-600">No resources found matching your criteria.</p>
        </div>
      )}

      <div className="text-center mt-8">
        <Button className="bg-primary hover:bg-blue-700 text-white">
          Load More Resources
        </Button>
      </div>
    </section>
  );
}
