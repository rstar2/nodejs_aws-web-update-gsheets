// Testing module for running the Express app locally without any AWS or ServerlessOffline wrappers

const app = require('.');
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Local Express server listening on port ${port}`);
});

