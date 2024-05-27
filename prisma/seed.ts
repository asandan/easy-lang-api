import { Account, Customer, PrismaClient, Translator } from "@prisma/client";
import addItems from "./data/addItems";
import { ACCOUNT_ITEMS, CUSTOMER_ITEMS, TRANSLATOR_ITEMS } from "./data/payloads";
import { addOrders } from "./data/addOrders";

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding... 🌱');
  try {
    await addItems<Account>(prisma, ACCOUNT_ITEMS, 'account');
    console.log('Account seeding finished.');
    await addItems<Customer>(prisma, CUSTOMER_ITEMS, 'customer');
    console.log('Customer seeding finished.');
    await addItems<Translator>(prisma, TRANSLATOR_ITEMS, 'translator');
    console.log('Translator seeding finished.');
    await addOrders(prisma);
    console.log('Order seeding finished.');
  } catch (e) {
    throw new Error(`Error while seeding data: ${e}`);
  }
  console.log('Seeding finished ✅');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });