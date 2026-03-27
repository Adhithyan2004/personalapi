 type ApplicationStatus =
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted";

  interface ApplicationBody {
  company: string;
  role: string;
  status: ApplicationStatus;
  }