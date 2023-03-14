import app from './app';
const port = 8080;

app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
