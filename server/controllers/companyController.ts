import { Request, Response } from 'express';
import { POPULAR_COMPANIES } from '../data/companies';

export function getCompanies(_req: Request, res: Response) {
  return res.json({
    success: true,
    companies: POPULAR_COMPANIES.map(c => ({
      id: c.id,
      name: c.name,
      tier: c.tier,
      interviewStyle: c.interviewStyle,
      primaryCodingFocus: c.primaryCodingFocus,
      hiringBarNote: c.hiringBarNote,
    })),
  });
}
