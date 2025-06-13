import express from 'express';
import cors from 'cors'

import indexRoute from "./routes/index.route";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', indexRoute);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
