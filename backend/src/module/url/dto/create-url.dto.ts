import { IsUrl, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original long URL to be shortened',
    example: 'https://www.example.com/very/long/url/path',
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  originalUrl: string;

  // @ApiPropertyOptional({
  //   description: 'Optional title for the URL',
  //   example: 'My Website',
  //   maxLength: 200,
  // })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  // @ApiPropertyOptional({
  //   description: 'Optional description for the URL',
  //   example: 'This is my personal website',
  //   maxLength: 500,
  // })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}