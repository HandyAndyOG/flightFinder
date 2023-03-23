import app from './app';
import * as dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 8080;

app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
