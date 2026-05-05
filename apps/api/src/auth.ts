import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@nativos/domain";
import { supabaseAdmin } from "./supabase.js";

export type AuthContext = {
  userId: string;
  tenantId: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Token requerido" });

    const { data: userResult, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userResult.user) return res.status(401).json({ error: "Token invalido" });

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("tenant_id, role")
      .eq("id", userResult.user.id)
      .single();

    if (profileError || !profile) return res.status(403).json({ error: "Perfil no configurado" });

    req.auth = {
      userId: userResult.user.id,
      tenantId: profile.tenant_id,
      role: profile.role
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: "Token requerido" });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: "Rol no autorizado" });
    next();
  };
}
