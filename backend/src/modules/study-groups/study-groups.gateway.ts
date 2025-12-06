import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/study-groups',
  cors: {
    origin: '*',
  },
})
export class StudyGroupsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // noop
  }

  handleDisconnect(client: Socket) {
    // noop
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @MessageBody() data: { groupId: number },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.groupId) return;
    client.join(this.roomName(data.groupId));
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(
    @MessageBody() data: { groupId: number },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data?.groupId) return;
    client.leave(this.roomName(data.groupId));
  }

  async broadcastMessage(groupId: number, payload: any) {
    this.server.to(this.roomName(groupId)).emit('newMessage', payload);
  }

  private roomName(groupId: number) {
    return `group_${groupId}`;
  }
}
