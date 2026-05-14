import { promises as fs } from "node:fs";
import path from "node:path";
import type { GenerateResponse, OrderResponse } from "@/lib/types";

const root = process.cwd();
const dataRoot = path.join(root, "data");
const sessionDir = path.join(dataRoot, "sessions");
const orderDir = path.join(dataRoot, "orders");
const generatedDir = path.join(root, "public", "generated");

async function ensureDirs() {
  await Promise.all([
    fs.mkdir(sessionDir, { recursive: true }),
    fs.mkdir(orderDir, { recursive: true }),
    fs.mkdir(generatedDir, { recursive: true })
  ]);
}

function safeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function saveSession(session: GenerateResponse) {
  await ensureDirs();
  const file = path.join(sessionDir, `${safeId(session.session_id)}.json`);
  await fs.writeFile(file, JSON.stringify(session, null, 2), "utf8");
}

export async function loadSession(sessionId: string): Promise<GenerateResponse | null> {
  await ensureDirs();
  try {
    const file = path.join(sessionDir, `${safeId(sessionId)}.json`);
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as GenerateResponse;
  } catch {
    return null;
  }
}

export async function saveOrder(order: OrderResponse) {
  await ensureDirs();
  const file = path.join(orderDir, `${safeId(order.order_id)}.json`);
  await fs.writeFile(file, JSON.stringify(order, null, 2), "utf8");
}

export async function loadOrder(orderId: string): Promise<OrderResponse | null> {
  await ensureDirs();
  try {
    const file = path.join(orderDir, `${safeId(orderId)}.json`);
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as OrderResponse;
  } catch {
    return null;
  }
}

export async function saveGeneratedSvg(sessionId: string, svg: string) {
  await ensureDirs();
  const filename = `${safeId(sessionId)}.svg`;
  await fs.writeFile(path.join(generatedDir, filename), svg, "utf8");
  return `/generated/${filename}`;
}

export async function saveGeneratedImage(sessionId: string, bytes: Buffer, extension = "png") {
  await ensureDirs();
  const safeExt = extension.replace(/[^a-zA-Z0-9]/g, "") || "png";
  const filename = `${safeId(sessionId)}.${safeExt}`;
  await fs.writeFile(path.join(generatedDir, filename), bytes);
  return `/generated/${filename}`;
}
