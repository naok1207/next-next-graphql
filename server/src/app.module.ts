import { GraphqlController } from './graphql/graphql.controller';
import { Module } from '@nestjs/common';
import { AuthzModule } from './authz/authz.module';
import { ItemsService } from './items/items.service';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [AuthzModule, ItemsModule],
  controllers: [GraphqlController],
  providers: [ItemsService],
})
export class AppModule {}
