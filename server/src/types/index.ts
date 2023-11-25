import express from 'express';

export interface IExpress {
  req: express.Request;
  res: express.Response;
}
