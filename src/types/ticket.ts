export interface Ticket {
  id: string;
  name?: string;
  description?: string;
  status: string;
  assignedTo?: string; // User ID
  priority?: string; // e.g., 'low', 'medium', 'high'
  deadline?: Date;
  helpfulNotes?: string;
  relatedSkills?: string[]; // Skills required for the ticket
  createdAt: Date;
  updatedAt?: Date;
}
