// ✅ Works with NextApiRequest
import formidable, { File } from "formidable";
import { NextApiRequest } from "next";

export const parseForm = (
  req: NextApiRequest
): Promise<{ fields: any; files: any }> => {
  const form = formidable({ multiples: false, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
