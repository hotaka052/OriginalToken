import { Req, Res, Controller, Post, Get } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class HelloController {
  @Get()
  responseHello() {
    return 'Hello';
  }

  @Post()
  responseMessage(@Req() req: Request, @Res() res: Response) {
    if (!(req.method === 'POST' && req.body)) {
      res.status(400).send('');
    }
    const event = req.body;
    let reply = {};
    if (event.type === 'MESSAGE') {
      reply = {
        text: `Hello ${event.user.displayName}`,
      };
    }
    res.json(reply);
  }
}
