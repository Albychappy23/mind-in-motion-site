import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Story } from "@shared/schema";

export default function StoriesSection() {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["/api/stories"],
  });

  const scrollToStoryForm = () => {
    const storyForm = document.getElementById("submit-story");
    if (storyForm) {
      storyForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="stories" className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 md:mb-0">
          Recovery Stories
        </h2>
        <Button 
          onClick={scrollToStoryForm}
          className="bg-accent hover:bg-green-600 text-white self-start md:self-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Share Your Story
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story: Story, index: number) => (
            <Card 
              key={story.id} 
              className={`hover:shadow-md transition-shadow duration-200 ${
                index % 2 === 0 
                  ? "bg-gradient-to-br from-blue-50 to-white border-blue-100" 
                  : "bg-gradient-to-br from-green-50 to-white border-green-100"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story.firstName}${story.lastName}`} 
                      alt={`${story.firstName} ${story.lastName}`} 
                    />
                    <AvatarFallback>
                      {story.firstName[0]}{story.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {story.firstName} {story.lastName}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {story.sport} • {story.injuryType}
                    </p>
                  </div>
                </div>
                <blockquote className="text-slate-700 italic mb-4">
                  "{story.content.length > 200 
                    ? `${story.content.substring(0, 200)}...` 
                    : story.content}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {formatDate(new Date(story.submittedAt))}
                  </span>
                  <Button variant="link" className="text-primary hover:text-blue-700 p-0">
                    Read Full Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {stories.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">No stories available yet.</p>
          <Button onClick={scrollToStoryForm} variant="outline">
            Be the first to share your story
          </Button>
        </div>
      )}

      <div className="text-center mt-8">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
          View All Stories
        </Button>
      </div>
    </section>
  );
}
