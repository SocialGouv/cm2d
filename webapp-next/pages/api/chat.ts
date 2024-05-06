// import { Configuration, OpenAIApi } from 'openai';
// import type { NextApiRequest, NextApiResponse } from 'next';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// });

// const openai = new OpenAIApi(configuration);

// type DataResponse = {
//   text: string;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<DataResponse>
// ) {
//   if (req.method === 'POST') {
//     const prompt = req.body.text;
//     const response = await openai.createCompletion({
//       model: 'text-davinci-003',
//       prompt: prompt,
//       max_tokens: 60
//     });

//     res
//       .status(200)
//       .json({ text: (response.data.choices[0].text || '').trim() });
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }
