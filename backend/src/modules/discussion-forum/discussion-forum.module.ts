import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  StudentDiscussionPost,
  StudentDiscussionComment,
  StudentDiscussionUpvote,
  StudentUser,
} from '../../database/entities/student';
import { DiscussionForumService } from './discussion-forum.service';
import { DiscussionForumController } from './discussion-forum.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentDiscussionPost,
      StudentDiscussionComment,
      StudentDiscussionUpvote,
      StudentUser,
    ]),
  ],
  providers: [DiscussionForumService],
  controllers: [DiscussionForumController],
  exports: [DiscussionForumService],
})
export class DiscussionForumModule {}
