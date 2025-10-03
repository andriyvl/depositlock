import { RequestHandler } from "express";
import { DemoResponse } from "@/lib-shared/model/api.types";

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
};
