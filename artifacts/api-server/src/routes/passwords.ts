import { Router } from "express";
import { analyzePassword } from "../lib/passwordAnalyzer.js";
import { generatePassword } from "../lib/passwordGenerator.js";
import { AnalyzePasswordBody, GeneratePasswordBody } from "@workspace/api-zod";

const router = Router();

router.post("/passwords/analyze", (req, res) => {
  const parsed = AnalyzePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const analysis = analyzePassword(parsed.data.password);
  res.json(analysis);
});

router.post("/passwords/generate", (req, res) => {
  const parsed = GeneratePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const opts = parsed.data;

  if (!opts.useUppercase && !opts.useLowercase && !opts.useDigits && !opts.useSymbols) {
    res.status(400).json({ error: "At least one character type must be selected" });
    return;
  }

  const password = generatePassword(opts);
  const analysis = analyzePassword(password);
  res.json({ password, analysis });
});

export default router;
