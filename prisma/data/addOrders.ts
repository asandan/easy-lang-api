import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { DAY } from '../../src/util';

export const addOrders = async (prisma: PrismaClient) => {
  const customers = await prisma.customer.findMany();
  const translators = await prisma.translator.findMany();

  for (const { id: customerId } of customers) {
    const randomOrdersAmount = faker.number.int({ max: 200, min: 0 });

    for (let i = 0; i < randomOrdersAmount; i++) {
      const title = faker.person.jobTitle().split(" ").slice(0, 2).join(" ");

      const withFinishDate = faker.number.int({ max: 1, min: 0 }) === 1;
      const withStartDate = faker.number.int({ max: 1, min: 0 }) === 1;
      const isCompletedByRandom = faker.number.int({ max: 10, min: 0 }) === 5;

      const { id: translatorId } = translators[faker.number.int({ max: translators.length - 1, min: 0 })];

      let status: Status;

      const totalPages = faker.number.int({ max: 300, min: 1 });

      let translatedPages: number | null = null;
      let isCompleted = false;

      if (isCompletedByRandom) {
        translatedPages = totalPages;
        isCompleted = true;
      } else {
        translatedPages = faker.number.int({ max: totalPages, min: 0 });
        isCompleted = translatedPages === totalPages;
      }

      const deadlineAt = faker.date.between({
        from: new Date(Date.now() - 60 * DAY),
        to: new Date(Date.now() + 20 * DAY),
      });

      let finishedAt: Date | null = null;
      let startedAt: Date | null = null;

      if (withStartDate || isCompleted || withFinishDate) {
        startedAt = faker.date.between({
          from: new Date(Date.now() - 60 * DAY),
          to: deadlineAt,
        });
      }

      if (withFinishDate || isCompleted) {
        if (startedAt) {
          finishedAt = faker.date.between({
            from: startedAt,
            to: deadlineAt,
          });
        } else {
          finishedAt = faker.date.between({
            from: new Date(Date.now() - 60 * DAY),
            to: deadlineAt,
          });
        }
      }

      if (startedAt && !finishedAt && new Date() >= startedAt && new Date() <= deadlineAt) {
        status = Status.IN_PROGRESS;
      } else if (isCompleted || finishedAt) {
        translatedPages = totalPages;
        status = Status.TRANSLATED;
      } else if (!startedAt) {
        translatedPages = 0;
        status = Status.NOT_STARTED;
      } else if (!isCompleted && new Date() > deadlineAt) {
        status = Status.OVERDUE;
      }

      const orderPayload: any = {
        status,
        title,
        totalPages,
        startedAt,
        deadlineAt,
        translatedPages,
        ...(finishedAt && { finishedAt }),
      };

      await prisma.order.create({
        data: {
          ...orderPayload,
          translator: {
            connect: {
              id: translatorId,
            }
          },
          customer: {
            connect: {
              id: customerId
            }
          }
        } as any,
      });
    }
  }
};
