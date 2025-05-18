import { rest } from 'msw';

let reviews: any[] = [];

export const handlers = [
  rest.get('/api/reviews', (req, res, ctx) => {
    return res(ctx.json(reviews));
  }),
  
  rest.post('/api/reviews', async (req, res, ctx) => {
    const newReview = await req.json();
    reviews = [...reviews, { 
      ...newReview, 
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString() 
    }];
    return res(ctx.status(201));
  })
];