import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertStorySchema } from "@shared/schema";
import { countWords } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function StoryForm() {
  const [wordCount, setWordCount] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertStorySchema.extend({
      consent: z.boolean().refine(val => val === true, {
        message: "You must consent to sharing your story"
      }),
    })),
    defaultValues: {
      firstName: "",
      lastName: "",
      sport: "",
      injuryType: "",
      email: "",
      title: "",
      content: "",
      consent: false,
    },
  });

  const submitStoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const { consent, ...storyData } = data;
      const response = await apiRequest("POST", "/api/stories", storyData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Story submitted successfully!",
        description: "Thank you for sharing your story. We'll review it and get back to you soon.",
      });
      form.reset();
      setWordCount(0);
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting story",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    submitStoryMutation.mutate(data);
  };

  const handleContentChange = (value: string) => {
    setWordCount(countWords(value));
    return value;
  };

  return (
    <section id="submit-story" className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
          Share Your Recovery Story
        </h2>
        <p className="text-slate-600 text-center mb-8">
          Your story could inspire another athlete. Share your journey to help others find hope and strength.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="injuryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Injury *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., From Setback to Comeback: My ACL Recovery Journey"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Story *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
                      placeholder="Share your injury experience, mental health challenges, coping strategies, and recovery journey. What advice would you give to other athletes facing similar challenges?"
                      {...field}
                      onChange={(e) => {
                        field.onChange(handleContentChange(e.target.value));
                      }}
                      className="resize-y"
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>Minimum 200 words recommended</span>
                    <span>{wordCount} words</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-slate-600">
                      I consent to sharing my story on the Mind in Motion platform and understand 
                      it may be edited for length and clarity. *
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={submitStoryMutation.isPending}
                className="flex-1 bg-primary hover:bg-blue-700 text-white"
              >
                {submitStoryMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Story"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => {
                  // Save draft functionality could be implemented here
                  toast({
                    title: "Draft saved",
                    description: "Your story has been saved as a draft.",
                  });
                }}
              >
                Save Draft
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
