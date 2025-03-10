import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import { RFileDownload } from '@/entities/file-upload-download';

let currentIndex = 1;

const createRandomData = (): RFileDownload => {
  return {
    index: String(currentIndex++),
    fileUploadTitle: faker.lorem.word(),
    note: faker.lorem.sentences(),
    uploadDateTime: format(faker.date.past(), 'yyyy-MM-dd HH:mm:ss'),
    uploadUser: faker.internet.username(),
  };
};

export async function* generateFileUploads({
  total = 2000,
  batchSize = 200,
  delayMs = 0,
}: {
  total?: number;
  batchSize?: number;
  delayMs?: number;
} = {}) {
  let generated = 0;
  while (generated < total) {
    const currentBatchSize = Math.min(batchSize, total - generated);
    const batch = Array.from({ length: currentBatchSize }, () => createRandomData());
    generated += currentBatchSize;
    yield batch;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
