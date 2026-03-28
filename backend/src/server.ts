import app from "./app";
import { startJanitor } from "./janitor";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startJanitor();
});


export default server;