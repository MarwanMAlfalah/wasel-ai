import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

const mutation = mutationGeneric;
const query = queryGeneric;

const DEMO_WORKSPACE_NAME = "demo-workspace";

function generateInvoiceNumber() {
  const shortTimestamp = Date.now().toString().slice(-6);
  return `WA-${shortTimestamp}`;
}

function generateToken() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}

export const ensureDemoWorkspace = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const existingWorkspace = await ctx.db
      .query("workspaces")
      .withIndex("by_name", (queryBuilder) =>
        queryBuilder.eq("name", DEMO_WORKSPACE_NAME),
      )
      .unique();

    if (!existingWorkspace) {
      await ctx.db.insert("workspaces", {
        name: DEMO_WORKSPACE_NAME,
        locale: "ar-SA",
        defaultCurrency: "SAR",
        createdAt: Date.now(),
      });
    }

    return DEMO_WORKSPACE_NAME;
  },
});

export const createInvoice = mutation({
  args: {
    workspaceId: v.string(),
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
  },
  returns: v.object({
    invoiceId: v.id("invoices"),
    token: v.string(),
    invoiceNumber: v.string(),
  }),
  handler: async (ctx, args) => {
    const now = Date.now();
    const token = generateToken();
    const invoiceNumber = generateInvoiceNumber();

    const invoiceId = await ctx.db.insert("invoices", {
      workspaceId: args.workspaceId,
      token,
      invoiceNumber,
      freelancerName: args.freelancerName,
      clientName: args.clientName,
      service: args.service,
      totalAmount: args.totalAmount,
      currency: args.currency,
      paidAmount: args.paidAmount,
      remainingAmount: args.remainingAmount,
      deliveryDate: args.deliveryDate,
      dueDate: args.dueDate,
      paymentStatus: args.paymentStatus,
      agreementTone: args.agreementTone,
      clientUrgency: args.clientUrgency,
      followUpStyle: args.followUpStyle,
      smartInsight: args.smartInsight,
      confidence: args.confidence,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("invoiceLinks", {
      invoiceId,
      token,
      active: true,
      firstViewedAt: null,
      lastViewedAt: null,
      viewCount: 0,
      createdAt: now,
    });

    return {
      invoiceId,
      token,
      invoiceNumber,
    };
  },
});

export const getInvoiceById = query({
  args: {
    invoiceId: v.id("invoices"),
  },
  returns: v.union(
    v.null(),
    v.object({
      invoiceId: v.id("invoices"),
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
      firstViewedAt: v.union(v.number(), v.null()),
      lastViewedAt: v.union(v.number(), v.null()),
      viewCount: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);

    if (!invoice) {
      return null;
    }

    const link = await ctx.db
      .query("invoiceLinks")
      .withIndex("by_invoice", (queryBuilder) =>
        queryBuilder.eq("invoiceId", args.invoiceId),
      )
      .unique();

    return {
      invoiceId: invoice._id,
      workspaceId: invoice.workspaceId,
      token: link?.token ?? invoice.token,
      invoiceNumber: invoice.invoiceNumber,
      freelancerName: invoice.freelancerName,
      clientName: invoice.clientName,
      service: invoice.service,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      paidAmount: invoice.paidAmount,
      remainingAmount: invoice.remainingAmount,
      deliveryDate: invoice.deliveryDate,
      dueDate: invoice.dueDate,
      paymentStatus: invoice.paymentStatus,
      agreementTone: invoice.agreementTone,
      clientUrgency: invoice.clientUrgency,
      followUpStyle: invoice.followUpStyle,
      smartInsight: invoice.smartInsight,
      confidence: invoice.confidence,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      firstViewedAt: link?.firstViewedAt ?? null,
      lastViewedAt: link?.lastViewedAt ?? null,
      viewCount: link?.viewCount ?? 0,
    };
  },
});

export const getInvoiceByToken = query({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      invoiceId: v.id("invoices"),
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
      firstViewedAt: v.union(v.number(), v.null()),
      lastViewedAt: v.union(v.number(), v.null()),
      viewCount: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("invoiceLinks")
      .withIndex("by_token", (queryBuilder) => queryBuilder.eq("token", args.token))
      .unique();

    if (!link || !link.active) {
      return null;
    }

    const invoice = await ctx.db.get(link.invoiceId);

    if (!invoice) {
      return null;
    }

    return {
      invoiceId: invoice._id,
      workspaceId: invoice.workspaceId,
      token: link.token,
      invoiceNumber: invoice.invoiceNumber,
      freelancerName: invoice.freelancerName,
      clientName: invoice.clientName,
      service: invoice.service,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      paidAmount: invoice.paidAmount,
      remainingAmount: invoice.remainingAmount,
      deliveryDate: invoice.deliveryDate,
      dueDate: invoice.dueDate,
      paymentStatus: invoice.paymentStatus,
      agreementTone: invoice.agreementTone,
      clientUrgency: invoice.clientUrgency,
      followUpStyle: invoice.followUpStyle,
      smartInsight: invoice.smartInsight,
      confidence: invoice.confidence,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      firstViewedAt: link.firstViewedAt,
      lastViewedAt: link.lastViewedAt,
      viewCount: link.viewCount,
    };
  },
});

export const listInvoices = query({
  args: {
    workspaceId: v.string(),
  },
  returns: v.array(
    v.object({
      invoiceId: v.id("invoices"),
      token: v.string(),
      invoiceNumber: v.string(),
      clientName: v.string(),
      service: v.string(),
      totalAmount: v.number(),
      currency: v.string(),
      remainingAmount: v.number(),
      paymentStatus: v.string(),
      dueDate: v.union(v.string(), v.null()),
      viewCount: v.number(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_workspace", (queryBuilder) =>
        queryBuilder.eq("workspaceId", args.workspaceId),
      )
      .order("desc")
      .collect();

    const invoiceList = await Promise.all(
      invoices.map(async (invoice) => {
        const link = await ctx.db
          .query("invoiceLinks")
          .withIndex("by_invoice", (queryBuilder) =>
            queryBuilder.eq("invoiceId", invoice._id),
          )
          .unique();

        return {
          invoiceId: invoice._id,
          token: link?.token ?? invoice.token,
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.clientName,
          service: invoice.service,
          totalAmount: invoice.totalAmount,
          currency: invoice.currency,
          remainingAmount: invoice.remainingAmount,
          paymentStatus: invoice.paymentStatus,
          dueDate: invoice.dueDate,
          viewCount: link?.viewCount ?? 0,
          createdAt: invoice.createdAt,
        };
      }),
    );

    return invoiceList.sort((left, right) => right.createdAt - left.createdAt);
  },
});

export const markInvoiceViewed = mutation({
  args: {
    token: v.string(),
    userAgent: v.union(v.string(), v.null()),
  },
  returns: v.union(
    v.null(),
    v.object({
      invoiceId: v.id("invoices"),
      token: v.string(),
      viewCount: v.number(),
      firstViewedAt: v.union(v.number(), v.null()),
      lastViewedAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("invoiceLinks")
      .withIndex("by_token", (queryBuilder) => queryBuilder.eq("token", args.token))
      .unique();

    if (!link || !link.active) {
      return null;
    }

    const now = Date.now();
    const firstViewedAt = link.firstViewedAt ?? now;
    const viewCount = link.viewCount + 1;

    await ctx.db.patch(link._id, {
      firstViewedAt,
      lastViewedAt: now,
      viewCount,
    });

    await ctx.db.insert("invoiceViewEvents", {
      invoiceId: link.invoiceId,
      token: args.token,
      viewedAt: now,
      userAgent: args.userAgent,
    });

    return {
      invoiceId: link.invoiceId,
      token: args.token,
      viewCount,
      firstViewedAt,
      lastViewedAt: now,
    };
  },
});
