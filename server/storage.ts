import { 
  users, resources, stories, contacts,
  type User, type InsertUser,
  type Resource, type InsertResource,
  type Story, type InsertStory,
  type Contact, type InsertContact
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resource operations
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResourceLikes(id: number, likes: number): Promise<Resource | undefined>;
  
  // Story operations
  getApprovedStories(): Promise<Story[]>;
  getPendingStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  approveStory(id: number): Promise<Story | undefined>;
  rejectStory(id: number): Promise<boolean>;
  
  // Contact operations
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resources: Map<number, Resource>;
  private stories: Map<number, Story>;
  private contacts: Map<number, Contact>;
  private currentUserId: number;
  private currentResourceId: number;
  private currentStoryId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.resources = new Map();
    this.stories = new Map();
    this.contacts = new Map();
    this.currentUserId = 1;
    this.currentResourceId = 1;
    this.currentStoryId = 1;
    this.currentContactId = 1;
    
    // Initialize with sample resources
    this.initializeResources();
    this.initializeStories();
  }

  private initializeResources() {
    const defaultResources: InsertResource[] = [
      {
        title: "Mindfulness Techniques",
        description: "Guided breathing exercises, meditation practices, and visualization techniques to help manage anxiety and stress during recovery.",
        category: "mindfulness",
        icon: "brain",
        url: "https://www.headspace.com/meditation/sport",
        rating: 4,
        likes: 24
      },
      {
        title: "Crisis Helplines",
        description: "24/7 support lines including NAMI (1-800-950-NAMI), Crisis Text Line (Text HOME to 741741), and National Suicide Prevention Lifeline.",
        category: "crisis",
        icon: "phone",
        url: "https://www.nami.org/help",
        rating: 5,
        likes: 45
      },
      {
        title: "Recommended Reading",
        description: "\"The Champion's Comeback\" by Jim Afremow, \"Mind Gym\" by Gary Mack, and other books focused on sports psychology and mental resilience.",
        category: "education",
        icon: "book",
        url: "https://www.amazon.com/Champions-Comeback-Great-Athletes-Recover/dp/054423142X",
        rating: 4,
        likes: 18
      },
      {
        title: "Recovery Journals",
        description: "Structured journaling templates and prompts designed specifically for athletes dealing with injury recovery and mental health challenges.",
        category: "tools",
        icon: "edit",
        url: "https://bulletjournal.com/pages/learn",
        rating: 4,
        likes: 31
      },
      {
        title: "Visualization Exercises",
        description: "Mental training techniques to help athletes visualize successful recovery and return to sport performance.",
        category: "mindfulness",
        icon: "eye",
        url: "https://www.psychologytoday.com/us/blog/sport-psychology/201210/visualization-techniques-athletes",
        rating: 4,
        likes: 22
      },
      {
        title: "Support Groups",
        description: "Information about local and online support groups for injured athletes, including peer mentorship programs.",
        category: "crisis",
        icon: "users",
        url: "https://www.mentalhealthamerica.net/finding-help",
        rating: 5,
        likes: 38
      }
    ];

    defaultResources.forEach(resource => {
      this.createResource(resource);
    });
  }

  private initializeStories() {
    const defaultStories = [
      {
        firstName: "Marcus",
        lastName: "Rodriguez",
        sport: "Soccer",
        injuryType: "ACL Recovery",
        email: "marcus.r@example.com",
        title: "From Setback to Comeback: My ACL Journey",
        content: "The mental battle was harder than the physical rehab. Learning to trust my knee again took months, but the mindfulness techniques helped me stay positive and eventually return stronger than before. The journey taught me that recovery isn't just about the body - it's about rebuilding confidence and mental strength.",
        approved: true,
        submittedAt: new Date(Date.now() - 86400000 * 90) // 90 days ago
      },
      {
        firstName: "Sarah",
        lastName: "Chen",
        sport: "Basketball",
        injuryType: "Ankle Injury",
        email: "sarah.c@example.com",
        title: "Finding Hope After My Basketball Injury",
        content: "I thought my basketball career was over. The depression hit hard, but connecting with other athletes going through similar experiences made all the difference in my recovery journey. This platform helped me realize I wasn't alone and that comeback stories are possible.",
        approved: true,
        submittedAt: new Date(Date.now() - 86400000 * 30) // 30 days ago
      }
    ];

    defaultStories.forEach(storyData => {
      const { approved, submittedAt, ...insertStory } = storyData;
      const id = this.currentStoryId++;
      const story: Story = { 
        ...insertStory, 
        id, 
        approved,
        submittedAt
      };
      this.stories.set(id, story);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resource operations
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.category === category
    );
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = { 
      id,
      title: insertResource.title,
      description: insertResource.description,
      category: insertResource.category,
      icon: insertResource.icon,
      url: insertResource.url || null,
      rating: insertResource.rating || 0,
      likes: insertResource.likes || 0
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResourceLikes(id: number, likes: number): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (resource) {
      const updated = { ...resource, likes };
      this.resources.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Story operations
  async getApprovedStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.approved);
  }

  async getPendingStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => !story.approved);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.currentStoryId++;
    const story: Story = { 
      ...insertStory, 
      id, 
      approved: false,
      submittedAt: new Date()
    };
    this.stories.set(id, story);
    return story;
  }

  async approveStory(id: number): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (story) {
      const updated = { ...story, approved: true };
      this.stories.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async rejectStory(id: number): Promise<boolean> {
    return this.stories.delete(id);
  }

  // Contact operations
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id,
      submittedAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
