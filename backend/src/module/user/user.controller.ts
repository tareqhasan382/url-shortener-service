import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res,HttpStatus} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import * as requestWithUserInterface from './dto/request-with-user.interface';
import sendResponse from '../../utils/sendResponse';
import express from 'express';
import {ApiOperation} from "@nestjs/swagger";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // STATIC route first
  @UseGuards(JwtAuthGuard)
  @Get('get-me')
  @ApiOperation({
    summary: 'Retrieve the profile of the authenticated user.',
    description:
      'Returns the full profile details of the currently logged-in user based on the JWT token.',
  })
  getMe(
    @Req() req: requestWithUserInterface.GetMe,
    @Res() res: express.Response,
  ) {
    const user = req.user;
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'GetME Retrieve successfully.',
      data: user,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
