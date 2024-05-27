import { PrismaClient, Prisma } from '@prisma/client';
import { RemoveDefaultFields } from 'src/util/types/utilTypes';

type PrismaOption = PrismaClient<Prisma.PrismaClientOptions, never>;

export type PrismaModel =
   keyof Omit<
      PrismaOption,
      | '$connect'
      | '$disconnect'
      | '$executeRaw'
      | '$executeRawUnsafe'
      | '$on'
      | '$queryRaw'
      | '$queryRawUnsafe'
      | '$transaction'
      | '$use'
      | '$extends'
      | symbol
    >
  | string;

/**
 * 
 * @param prisma - PrismaClient instance
 * @param payload - An array of payload
 */
const addItems = async <T>(
  prisma: PrismaClient,
  payload: RemoveDefaultFields<T>[],
  model: PrismaModel,
) => {
  await Promise.allSettled(
    payload.map(async (el) => {
      try {
        await prisma[model].create({
          data: el,
        });
      } catch (e) {
        console.log(e);
      }
    }),
  );
};

export default addItems;