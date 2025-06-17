import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema } from "@shared/schema";
import { Mail, Clock, Loader2 } from "lucide-react";

export default function ContactSection() {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiryType: "",
      message: "",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll respond within 24-48 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    submitContactMutation.mutate(data);
  };

  return (
    <section id="contact" className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
          Get in Touch
        </h2>
        <p className="text-slate-600 text-center mb-8">
          Partner with us, suggest resources, or get involved in supporting athlete mental health.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="inquiryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inquiry Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="resource">Resource Suggestion</SelectItem>
                      <SelectItem value="collaboration">Collaboration Request</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Tell us about your inquiry, suggestion, or how you'd like to get involved..."
                      {...field}
                      className="resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitContactMutation.isPending}
              className="w-full bg-primary hover:bg-blue-700 text-white"
            >
              {submitContactMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-slate-800 mb-4">Direct Contact</h3>
          <div className="space-y-2 text-slate-600">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-primary" />
              <span>mindinmotionproject@gmail.com</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>Response time: 24-48 hours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
