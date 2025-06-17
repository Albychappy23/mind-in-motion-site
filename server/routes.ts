import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStorySchema, insertContactSchema, insertResourceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Resources endpoints
  app.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category as string;
      const resources = category 
        ? await storage.getResourcesByCategory(category)
        : await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { likes } = req.body;
      
      if (isNaN(id) || typeof likes !== 'number') {
        return res.status(400).json({ message: "Invalid input" });
      }

      const resource = await storage.updateResourceLikes(id, likes);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to update resource" });
    }
  });

  // Stories endpoints
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getApprovedStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/pending", async (req, res) => {
    try {
      const stories = await storage.getPendingStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending stories" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.status(201).json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid story data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  app.post("/api/stories/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const story = await storage.approveStory(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve story" });
    }
  });

  app.delete("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const deleted = await storage.rejectStory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      res.json({ message: "Story deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete story" });
    }
  });

  // Contact endpoints
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
