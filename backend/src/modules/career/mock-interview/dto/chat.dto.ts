import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;
}

export class ChatRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @IsBoolean()
  @IsOptional()
  disableTools?: boolean;
}

export class ToolCallDto {
  @IsString()
  name: string;

  @IsOptional()
  challenge?: any;

  @IsOptional()
  assessment?: any;
}

export class ChatResponseDto {
  @IsString()
  content: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ToolCallDto)
  tool_call: ToolCallDto | null;
}
