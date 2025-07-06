"use client";

import { useState } from "react";
import EmailLogList from "./components/EmailLogList";
import AuditTrailList from "./components/AuditTrailList";
import ErrorLogList from "./components/ErrorLogList";

// Define interfaces
export interface EmailLog {
  id: string;
  subject: string;
  to: string[];
  status: "sent" | "failed" | "pending";
  sentAt: string; // ISO date string
  error?: string;
}

export interface AuditTrail {
  id: string;
  action: string;
  user: string;
  timestamp: string; // ISO date string
  details: string;
}

export interface ErrorLog {
  id: string;
  message: string;
  stackTrace: string;
  timestamp: string; // ISO date string
  severity: "low" | "medium" | "high";
}

export default function LogsAuditManagement() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([
    { id: "1", subject: "Weekly Newsletter", to: ["john.doe@example.com"], status: "sent", sentAt: new Date().toISOString() },
    { id: "2", subject: "Promotion Alert", to: ["jane.smith@example.com"], status: "failed", sentAt: new Date().toISOString(), error: "SMTP server error" },
  ]);
  const [auditTrail, setAuditTrail] = useState<AuditTrail[]>([
    { id: "1", action: "User Login", user: "admin", timestamp: new Date().toISOString(), details: "Logged in from IP 192.168.1.1" },
    { id: "2", action: "Email Sent", user: "admin", timestamp: new Date().toISOString(), details: "Sent newsletter to 50 subscribers" },
  ]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([
    { id: "1", message: "Database connection failed", stackTrace: "stack trace here", timestamp: new Date().toISOString(), severity: "high" },
    { id: "2", message: "API rate limit exceeded", stackTrace: "stack trace here", timestamp: new Date().toISOString(), severity: "medium" },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Logs & Audit Trail - Books Store</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Email Logs</h2>
          <EmailLogList logs={emailLogs} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
          <AuditTrailList logs={auditTrail} />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Error Logs (Backend Monitoring)</h2>
        <ErrorLogList logs={errorLogs} />
      </div>
    </div>
  );
}