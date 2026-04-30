import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspaces: defineTable({
    name: v.string(),
    locale: v.string(),
    defaultCurrency: v.string(),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  invoices: defineTable({
    workspaceId: v.string(),
    token: v.string(),
    invoiceNumber: v.string(),
    freelancerName: v.string(),
    clientName: v.string(),
    service: v.string(),
    totalAmount: v.number(),
    currency: v.string(),
    paidAmount: v.number(),
    remainingAmount: v.number(),
    deliveryDate: v.union(v.string(), v.null()),
    dueDate: v.union(v.string(), v.null()),
    paymentStatus: v.string(),
    agreementTone: v.string(),
    clientUrgency: v.string(),
    followUpStyle: v.string(),
    smartInsight: v.string(),
    confidence: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_token", ["token"]),

  invoiceLinks: defineTable({
    invoiceId: v.id("invoices"),
    token: v.string(),
    active: v.boolean(),
    firstViewedAt: v.union(v.number(), v.null()),
    lastViewedAt: v.union(v.number(), v.null()),
    viewCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_invoice", ["invoiceId"])
    .index("by_token", ["token"]),

  invoiceViewEvents: defineTable({
    invoiceId: v.id("invoices"),
    token: v.string(),
    viewedAt: v.number(),
    userAgent: v.union(v.string(), v.null()),
  }).index("by_invoice", ["invoiceId"]),
});
