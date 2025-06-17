import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle, Eye, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Story } from "@shared/schema";

interface AdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminModal({ open, onOpenChange }: AdminModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingStories = [], isLoading } = useQuery({
    queryKey: ["/api/stories/pending"],
    enabled: open,
  });

  const { data: publishedStories = [] } = useQuery({
    queryKey: ["/api/stories"],
    enabled: open,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/stories/${id}/approve`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Story approved",
        description: "The story has been published successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stories/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error approving story",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/stories/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Story rejected",
        description: "The story has been removed.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stories/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error rejecting story",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    if (confirm("Are you sure you want to reject this story? This action cannot be undone.")) {
      rejectMutation.mutate(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Admin Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pending Stories</p>
                    <p className="text-2xl font-bold text-primary">{pendingStories.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Published Stories</p>
                    <p className="text-2xl font-bold text-accent">{publishedStories.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Resource Views</p>
                    <p className="text-2xl font-bold text-yellow-600">1,247</p>
                  </div>
                  <Eye className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Stories */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Pending Story Submissions</h3>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : pendingStories.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-slate-600">No pending stories to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingStories.map((story: Story) => (
                  <Card key={story.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-slate-800">{story.title}</h5>
                          <p className="text-sm text-slate-600">
                            by {story.firstName} {story.lastName}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                            <span>Sport: {story.sport}</span>
                            <span>Injury: {story.injuryType}</span>
                            <span>Submitted: {formatDate(new Date(story.submittedAt))}</span>
                          </div>
                          {story.content && (
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                              {story.content.length > 150 
                                ? `${story.content.substring(0, 150)}...` 
                                : story.content}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleApprove(story.id)}
                            disabled={approveMutation.isPending}
                            className="bg-accent hover:bg-green-600 text-white text-sm"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="text-sm"
                            onClick={() => {
                              // Review functionality - could open a detailed view
                              toast({
                                title: "Review feature",
                                description: "Detailed review interface would open here.",
                              });
                            }}
                          >
                            Review
                          </Button>
                          <Button
                            onClick={() => handleReject(story.id)}
                            disabled={rejectMutation.isPending}
                            variant="destructive"
                            className="text-sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
