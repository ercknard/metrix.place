import { NextApiResponse } from 'next';

export const e_badrequest = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res
    .status(400)
    .json({ error: true, message: `Method ${method} Bad Request`, detail });
};

export const e_unauthorized = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res
    .status(401)
    .json({ error: true, message: `Method ${method} Unauthorized`, detail });
};

export const e_denied = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res
    .status(403)
    .json({ error: true, message: `Method ${method} Forbidden`, detail });
};

export const e_notfound = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res
    .status(404)
    .json({ error: true, message: `Method ${method} Not Found`, detail });
};

export const e_notallow = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res
    .status(405)
    .json({ error: true, message: `Method ${method} Not Allowed`, detail });
};

export const e_unknown = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res
    .status(406)
    .json({ error: true, message: `Method ${method} Not Acceptable`, detail });
};

export const e_parameter = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res.status(412).json({
    error: true,
    message: `Method ${method} Precondition Failed`,
    detail
  });
};

export const e_authrequire = (
  res: NextApiResponse,
  method: string,
  detail?: string
) => {
  return res.status(511).json({
    error: true,
    message: `Method ${method} Network Authentication Required`,
    detail
  });
};
