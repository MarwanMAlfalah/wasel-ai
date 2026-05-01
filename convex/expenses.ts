import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

const mutation = mutationGeneric;
const query = queryGeneric;

export const addExpense = mutation({
  args: {
    invoiceId: v.id("invoices"),
    workspaceId: v.string(),
    amount: v.number(),
    currency: v.string(),
    category: v.string(),
    note: v.optional(v.union(v.string(), v.null())),
  },
  returns: v.object({
    id: v.id("expenses"),
    invoiceId: v.id("invoices"),
    workspaceId: v.string(),
    amount: v.number(),
    currency: v.string(),
    category: v.string(),
    note: v.union(v.string(), v.null()),
    createdAt: v.number(),
  }),
  handler: async (ctx, args) => {
    if (args.amount <= 0) {
      throw new Error("Expense amount must be greater than zero");
    }

    const invoice = await ctx.db.get(args.invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const createdAt = Date.now();
    const id = await ctx.db.insert("expenses", {
      invoiceId: args.invoiceId,
      workspaceId: args.workspaceId,
      amount: args.amount,
      currency: args.currency,
      category: args.category,
      note: args.note ?? null,
      createdAt,
    });

    return {
      id,
      invoiceId: args.invoiceId,
      workspaceId: args.workspaceId,
      amount: args.amount,
      currency: args.currency,
      category: args.category,
      note: args.note ?? null,
      createdAt,
    };
  },
});

export const listExpensesByInvoice = query({
  args: {
    invoiceId: v.id("invoices"),
  },
  returns: v.array(
    v.object({
      id: v.id("expenses"),
      invoiceId: v.id("invoices"),
      workspaceId: v.string(),
      amount: v.number(),
      currency: v.string(),
      category: v.string(),
      note: v.union(v.string(), v.null()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_invoice", (queryBuilder) =>
        queryBuilder.eq("invoiceId", args.invoiceId),
      )
      .order("desc")
      .collect();

    return expenses.map((expense) => ({
      id: expense._id,
      invoiceId: expense.invoiceId,
      workspaceId: expense.workspaceId,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      note: expense.note,
      createdAt: expense.createdAt,
    }));
  },
});

export const getInvoiceFinancialSummary = query({
  args: {
    invoiceId: v.id("invoices"),
  },
  returns: v.object({
    totalAmount: v.number(),
    paidAmount: v.number(),
    remainingAmount: v.number(),
    totalExpenses: v.number(),
    expectedProfit: v.number(),
    currency: v.string(),
  }),
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_invoice", (queryBuilder) =>
        queryBuilder.eq("invoiceId", args.invoiceId),
      )
      .collect();

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const remainingAmount =
      typeof invoice.remainingAmount === "number"
        ? invoice.remainingAmount
        : invoice.totalAmount - invoice.paidAmount;

    return {
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      remainingAmount,
      totalExpenses,
      expectedProfit: invoice.totalAmount - totalExpenses,
      currency: invoice.currency,
    };
  },
});
