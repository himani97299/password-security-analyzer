import { analyzePassword } from '../../artifacts/api-server/src/lib/passwordAnalyzer';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body ?? {};
  if (typeof password !== 'string') {
    return res.status(400).json({ error: 'password must be a string' });
  }

  const analysis = analyzePassword(password);
  return res.json(analysis);
}
