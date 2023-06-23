import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const TypeOrmTestBase = ([entities]) =>
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: () => {
      return {
        type: 'postgres',
        database: `mucochat_test`,
        host: `localhost`,
        username: `common`,
        password: `common`,
        port: 5432,
        synchronize: process.env.NODE_ENV === 'prod' ? false : true,
        logging: process.env.NODE_ENV === 'prod' ? false : false,
        namingStrategy: new SnakeNamingStrategy(),
        ssl:
          process.env.NODE_ENV === 'prod'
            ? { rejectUnauthorized: false }
            : false,
        entities: [entities],
      };
    },
  });
