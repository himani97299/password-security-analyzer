import { generatePassword } from '../../artifacts/api-server/src/lib/passwordGenerator';
import { analyzePassword } from '../../artifacts/api-server/src/lib/passwordAnalyzer';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { length, useUppercase, useLowercase, useDigits, useSymbols, excludeSimilar } = req.body ?? {};

  if (typeof length !== 'number' || length < 4 || length > 128) {
    return res.status(400).json({ error: 'length must be a number between 4 and 128' });
  }
  if (!useUppercase && !useLowercase && !useDigits && !useSymbols) {
    return res.status(400).json({ error: 'At least one character type must be selected' });
  }

  const password = generatePassword({
    length,
    useUppercase: !!useUppercase,
    useLowercase: !!useLowercase,
    useDigits: !!useDigits,
    useSymbols: !!useSymbols,
    excludeSimilar: !!excludeSimilar,
  });
  const analysis = analyzePassword(password);
  return res.json({ password, analysis });
}
