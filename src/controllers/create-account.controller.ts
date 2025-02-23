import {
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
@Controller()
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post('/accounts')
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body)

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    const hashedPassword = await hash(password, 8)

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists',
      )
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
