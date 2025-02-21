/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller()
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post('/accounts')
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists',
      )
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
