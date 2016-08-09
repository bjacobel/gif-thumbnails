import { handler } from './src/index';
import testData from './test.json';

handler(testData, null, (err, message) => {
  console.error(err);
  console.log(message);
});
